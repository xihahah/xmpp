//    XMPP plugins for Strophe v1.0.5

//    (c) 2012-2013 Yiorgis Gozadinos.
//    strophe.plugins is distributed under the MIT license.
//    http://github.com/ggozad/strophe.plugins


// Plugin to deal with basic instant messaging

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'underscore', 'backbone', 'strophe/strophe'], function ($, _, Backbone, wrapper) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return factory($, _, Backbone, wrapper.Strophe, wrapper.$msg);
        });
    } else {
        // Browser globals
        factory(root.$, root._, root.Backbone, root.Strophe, root.$msg);
    }
}(this,function ($, _, Backbone, Strophe, $msg) {

    Strophe.addConnectionPlugin('Messaging', {

        _connection: null,
        _composingTimeout: 3000,
        _composing: {},

        init: function (conn) {
            this._connection = conn;
            Strophe.addNamespace('XHTML_IM', 'http://jabber.org/protocol/xhtml-im');
            Strophe.addNamespace('XHTML', 'http://www.w3.org/1999/xhtml');
            Strophe.addNamespace('CHATSTATES', 'http://jabber.org/protocol/chatstates');
            // _.extend(this, Backbone.Events);
        },

        // Register message notifications when connected
        statusChanged: function (status, condition) {
            if (status === Strophe.Status.CONNECTED || status === Strophe.Status.ATTACHED) {
                this._connection.addHandler(this._onReceiveChatMessage.bind(this), null, 'message', 'chat');
            }
        },

        // Upon message receipt trigger an `xmpp:message` event.
        _onReceiveChatMessage: function (message) {
            var body, html_body;
            body = $(message).children('body').text();

            if ($('composing', message).length > 0) {
                this.trigger('xmpp:composing', {
                    jid: message.getAttribute('from'),
                    thread: $('thread', message).text()
                });
                return true;
            }

            if ($('paused', message).length > 0) {
                this.trigger('xmpp:paused', {
                    jid: message.getAttribute('from'),
                    thread: $('thread', message).text()
                });
                return true;
            }

            if (body === '') {
                return true; // Typing notifications are not handled.
            }

            html_body = $('html > body', message);
            if (html_body.length > 0) {
                html_body = $('<div>').append(html_body.contents()).html();
            } else {
                html_body = null;
            }
            this.trigger('xmpp:message', {
                jid: message.getAttribute('from'),
                type: message.getAttribute('type'),
                body: body,
                html_body: html_body});
            return true;
        },

        // **send** sends a message. `body` is the plaintext contents whereas `html_body` is the html version.
        send: function (to, body, html_body) {
            var msg = $msg({to: to, type: 'chat'});

            if (body) {
                msg.c('body', {}).t(body);
            }

            if (html_body) {
                msg.c('html', {xmlns: Strophe.NS.XHTML_IM})
                    .c('body', {xmlns: Strophe.NS.XHTML})
                    .h(html_body);
            }
            this._connection.send(msg.tree());
        },

        // **composing** notifies ``jid`` that the user is currently composing a message.
        // Pass ``thread`` for context and ``timeout`` to override the default timeout of 3 seconds.
        // Subsequent calls to **composing** will be ignored but reset the timeout.
        composing: function (to, thread, timeout) {
            var self = this,
                msg, cIndex;

            cIndex = thread ? to + thread : to;
            timeout = timeout || this._composingTimeout;
            if (this._composing[cIndex]) {
                this._composing[cIndex].call();
                return;
            }

            this._composing[cIndex] = _.debounce(function () {
                self._paused(to, thread);
            }, timeout);

            msg = $msg({to: to, type: 'chat'});

            if (thread) {
                msg.c('thread', {}, thread);
            }
            msg.c('composing', {xmlns: Strophe.NS.CHATSTATES});
            this._connection.send(msg.tree());
        },

        // **_paused** is internally used to mark the end of message composition, see **composing**.
        _paused: function (to, thread) {
            var msg, cIndex;

            cIndex = thread ? to + thread : to;

            if (this._composing[cIndex]) {
                delete this._composing[cIndex];
            }

            msg = $msg({to: to, type: 'chat'});

            if (thread) {
                msg.c('thread', {}, thread);
            }
            msg.c('paused', {xmlns: Strophe.NS.CHATSTATES});
            this._connection.send(msg.tree());
        }

    });
}));
