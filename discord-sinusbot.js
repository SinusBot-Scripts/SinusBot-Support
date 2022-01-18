/**
 * Forum: https://forum.sinusbot.com
 * GitHub: https://github.com/SinusBot-Scripts/SinusBot-Support
 */

registerPlugin({
    name: 'Discord SinusBot',
    version: '2.2.3',
    description: 'Useful commands for the official SinusBot Discord server.',
    author: 'Andreas Fink (RealPanter), Lala Sabathil (Lulalaby), Jonas Bögle (irgendwr)',
    engine: '>= 1.0.0',
    backends: ['discord'],
    requiredModules: ['http', 'discord-dangerous'],
    vars: [{
        name: 'api_forum',
        title: 'Forum API URL',
        type: 'string',
        placeholder: 'https://forum.example.com/api?id=%ID%'
    }, ]
}, (_, config, meta) => {
    const event = require('event')
    const engine = require('engine')
    const backend = require('backend')
    const http = require('http')

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position) {
          position = position || 0;
          return this.indexOf(searchString, position) === position;
        };
      }      
    
    engine.log(`Loaded ${meta.name} v${meta.version} by ${meta.author}.`)

    const urlPattern = /^https:\/\/forum\.sinusbot\.com\/members\/(?:.*\.)?(\d+)\/(?:#.*)?$/;
    const tagPattern = /^ ?<@!?\d{18}> ?$/;

    event.on('load', () => {
        const command = require('command')
        if (!command) {
            engine.log('command.js library not found! Please download command.js to your scripts folder and restart the SinusBot, otherwise this script will not work.');
            engine.log('command.js can be found here: https://github.com/Multivit4min/Sinusbot-Command/blob/master/command.js');
            return;
        }

        command.createCommand('needinfo')
            .forcePrefix('!')
            .addArgument(command.createArgument('string').setName('user').optional())
            .help('Lists required information that we need to be able to help')
            .manual('Lists required information that we need to be able to help.')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                let pre = 'Please **send us all of the information listed below**, depending on your OS.\n'
                if (tagPattern.exec(args.user) != null) {
                    pre = `Hi ${args.user}! ` + pre
                }
                reply(pre + `
> :penguin: **Linux**
1) Output of the diagnostic script: <https://forum.sinusbot.com/threads/diagscript.831/>
Share these via <https://pastebin.com> to reduce spam.

> :snail: **Windows**
1) OS (operating system), e.g. *Windows 10 64bit*
2) SinusBot version (<https://sinusbot.github.io/docs/faq/general/#what-is-my-version>)
3) TeamSpeak Client version
4) Instance log / SinusBot log (set \`LogLevel = 10\` in your \`config.ini\` before)
**Share these via <https://pastebin.com>** to reduce spam.

*This automated message was triggered by ${client.getURL()}*`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('needinfo-linux')
            .alias('needinfolinux', 'linuxinfo', 'infolinux')
            .forcePrefix('!')
            .addArgument(command.createArgument('string').setName('user').optional())
            .help('Lists required information that we need to be able to help')
            .manual('Lists required information that we need to be able to help.')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                let pre = 'Please **send us all of the information listed below**.'
                if (tagPattern.exec(args.user) != null) {
                    pre = `Hi ${args.user}! ` + pre
                }
                reply(pre + ` *This assumes you're using Linux*

1) **Send us the output of the diagnostic script**:
\`\`\`bash
# before running the diag script you might need to install depencencies
apt-get install bc binutils coreutils lsb-release util-linux net-tools curl
# change to your path:
cd /opt/sinusbot/
# execute with root privileges, sudo may be required:
bash <(wget -O - https://raw.githubusercontent.com/patschi/sinusbot-tools/master/tools/diagSinusbot.sh)
\`\`\`
2) And the **Instance log / SinusBot log** (set \`LogLevel = 10\` in your \`config.ini\` before)
**Share these via <https://pastebin.com>** to reduce spam.

*This automated message was triggered by ${client.getURL()}*`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('needinfo-windows')
            .alias('needinfo-win', 'needinfowindows', 'needinfowin', 'windowsinfo', 'wininfo', 'infowin')
            .forcePrefix('!')
            .addArgument(command.createArgument('string').setName('user').optional())
            .help('Lists required information that we need to be able to help')
            .manual('Lists required information that we need to be able to help.')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                let pre = 'Please **send us all of the information listed below**.'
                if (tagPattern.exec(args.user) != null) {
                    pre = `Hi ${args.user}! ` + pre
                }
                reply(pre + ` *This assumes you're using Windows*

1) OS (operating system), e.g. *Windows 10 64bit*
2) SinusBot version (<https://sinusbot.github.io/docs/faq/general/#what-is-my-version>)
3) TeamSpeak Client version
4) Instance log / SinusBot log (set \`LogLevel = 10\` in your \`config.ini\` before)
**Please share the logs via <https://pastebin.com> to reduce spam.**

*This automated message was triggered by ${client.getURL()}*`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('diagscript')
            .forcePrefix('!')
            .help('SinusBot Documentation: diagscript')
            .manual('SinusBot Documentation: diagscript')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`\`\`\`bash
# before running the diag script you might need to install depencencies
apt-get install bc binutils coreutils lsb-release util-linux net-tools curl
# change to your path:
cd /opt/sinusbot/
# execute with root privileges, sudo may be required:
bash <(wget -O - https://raw.githubusercontent.com/patschi/sinusbot-tools/master/tools/diagSinusbot.sh)
\`\`\`
**Please share the logs via <https://pastebin.com> to reduce spam.**

*This automated message was triggered by ${client.getURL()}*`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('install')
            .forcePrefix('!')
            .help('SinusBot Documentation: install')
            .manual('SinusBot Documentation: install')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`Install SinusBot from here:
Linux: <https://sinusbot.github.io/docs/installation/linux/>
Windows: <https://sinusbot.github.io/docs/installation/windows/>
Docker: <https://sinusbot.github.io/docs/installation/docker/>`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('youtube-dl')
            .alias('ytdldoc', 'ytdldocs')
            .forcePrefix('!')
            .help('SinusBot Documentation: youtube-dl')
            .manual('SinusBot Documentation: youtube-dl')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`<https://sinusbot.github.io/docs/youtube-dl/>`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('faq')
            .forcePrefix('!')
            .help('SinusBot FAQ')
            .manual('SinusBot FAQ')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`SinusBot Documentation: <https://sinusbot.github.io/docs/faq/general/>`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('docs')
            .forcePrefix('!')
            .help('SinusBot Documentation')
            .manual('SinusBot Documentation')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`SinusBot Documentation: <https://sinusbot.github.io/docs/>`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('scripts')
            .alias('scripting')
            .forcePrefix('!')
            .help('SinusBot Documentation: Scripts')
            .manual('SinusBot Documentation: Scripts')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`About writing scripts: <https://sinusbot.github.io/docs/scripts/>
Scripting Documentation: <https://sinusbot.github.io/scripting-docs/>
Scripts: <https://forum.sinusbot.com/resources/categories/scripts.2/>`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('license')
            .alias('lic')
            .forcePrefix('!')
            .help('SinusBot Documentation: Licenses')
            .manual('SinusBot Documentation: Licenses')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`Information about Licenses: <https://sinusbot.github.io/docs/licenses/>`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('3rdparty')
            .alias('noscriptsupport', 'scriptsupport')
            .forcePrefix('!')
            .help('Reminder: no 3rd party support')
            .manual('Reminder: We don\'t offer support for 3rd-party scripts / installers / images.')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`We don't offer support for 3rd-party scripts / installers / images. Ask for help in the discussions thread of the script (in the forum) instead.`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('forum')
            .forcePrefix('!')
            .help('SinusBot Forum')
            .manual('SinusBot Forum')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`SinusBot Forum: <https://forum.sinusbot.com/>`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('pastebin')
            .forcePrefix('!')
            .help('Pastebin')
            .manual('Pastebin')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`Please share any code via <https://pastebin.com> to reduce spam.`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('partners')
            .alias('partner', 'hoster', 'hosters')
            .forcePrefix('!')
            .help('SinusBot-Partners')
            .manual('Lists the SinusBot-Partners')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`The current SinusBot-Partners:           
4NETPLAYERS: <https://gameserver.4players.de/sinusbot-server-mieten.html>
Clanwarz: <https://www.clanwarz.com/sinusbot-servers>
DATHOSTING: https://www.dathosting.eu/hosting/sinusbot/
MC-HOST24: <https://mc-host24.de/musicbot-mieten>
TS3INDEX.COM: <http://ts3index.com/hosting/?ref=sinusbot>`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('multiple-messages')
            .alias('multiplemessages', 'multiple', 'mmsg', 'mm')
            .forcePrefix('!')
            .help('Reminder: No multiple channels')
            .manual('Reminder: Questions should only be asked once.')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`Please don't ask for help in multiple channels, we won't help you faster.`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('ping')
            .forcePrefix('!')
            .help('Reminder: Don\'t ping others.')
            .manual('Reminder: Don\'t ping others.')
            .addArgument(command.createArgument('string').setName('user').optional())
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                let pre = ""
                if (tagPattern.exec(args.user) != null) {
                    pre = `Hi ${args.user}! `
                }
                reply(`${pre}Please don't ping people. We all do this volunteer in our free time. Also remember that random pings can result in a ban.`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })
        
        command.createCommand('lmgtfy')
            .alias('google', 'gidf')
            .forcePrefix('!')
            .addArgument(args => args.rest.setName("args"))
            .help('Returns an LMGTFY-link.')
            .manual('Returns an LMGTFY-link.')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                let q = args.args.trim().replace(/\s/g, '%20');

                let link = `https://lmgtfy.app/?q=${q}`;

                reply(`Maybe that could help you: <${link}>`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('reboot')
            .alias('restart', 'neustart')
            .forcePrefix('!')
            .help('Reminder: Reboot')
            .manual('Reminder: Reboot')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`Quick reminder: Have you already tried to turn your device off and on again?`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('installer')
            .forcePrefix('!')
            .help('SinusBot Installer')
            .manual('SinusBot Installer')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`SinusBot Installer: <https://sinusbot.github.io/installer/>`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('installer-error')
            .alias('installererror')
            .forcePrefix('!')
            .help('Reminder: Installer Script support in forum')
            .manual('Reminder: Issues with the Installer Script should be posted in it\'s forum thread.')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`Issues with the Installer Script should be posted in it's forum thread: <https://forum.sinusbot.com/threads/sinusbot-installer-script.1200/page-999>`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

            command.createCommand('oldversion')
            .alias('old', 'version')
            .forcePrefix('!')
            .help('Reminder: New version availlable')
            .manual('Reminder: Please install the newest version.')
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                reply(`Your version looks quite old, huh? Please install the newest version of SinusBot from here:
Linux: <https://sinusbot.github.io/docs/installation/linux/>
Windows: <https://sinusbot.github.io/docs/installation/windows/>
Docker: <https://sinusbot.github.io/docs/installation/docker/>`)
                // try to delete original message to reduce spam
                ev.message.delete()
            })

        command.createCommand('roles')
            .alias('groups')
            .forcePrefix('!')
            .addArgument(command.createArgument('string').setName('url'))
            .help('Gives you the groups from the SinusBot Forum')
            .manual('Gives you the groups from the SinusBot Forum.\nThis only works if you set your full discord username (for example: `flyth#2478`) in your forum settings: <https://forum.sinusbot.com/account/account-details>.')
            .exec(( /** @type {Client} */ client, /** @type {object} */ args, /** @type {(message: string)=>void} */ reply) => {
                if (!args.url) {
                    getUser(client).then(user => {
                        const tag = user.username + '#' + user.discriminator
                        reply(`To get the groups from your forum account you need to:
1) Set your full discord username \`${tag}\` in your forum settings: <https://forum.sinusbot.com/account/account-details>
2) Write \`!roles <link to your profile>\` in <#534460311575461940>`)
                    })
                    return;
                }

                let matches = urlPattern.exec(args.url)
                if (!matches || matches.length < 2) {
                    reply('That\'s not a valid url.\nExample of a valid url: `https://forum.sinusbot.com/members/flyth.2/`')
                    return;
                }

                let id = matches[1];
                http.simpleRequest({
                    'method': 'GET',
                    'url': config.api_forum.replace(/%ID%/gi, encodeURIComponent(id)),
                    'timeout': 6000,
                }, function (error, response) {
                    if (error) {
                        engine.log("Error: " + error);
                        reply('Error: API error #1 :sad:');
                        return;
                    }

                    if (response.statusCode != 200) {
                        engine.log("HTTP Error: " + response.status);
                        reply('Error: API error #2 :sad:');
                        return;
                    }

                    // parse JSON response
                    var res;
                    try {
                        res = JSON.parse(response.data.toString());
                    } catch (err) {
                        engine.log(err.message);
                    }

                    // check if parsing was successfull
                    if (res === undefined) {
                        engine.log("Invalid JSON.");
                        reply('Error: invalid response :sad:');
                        return;
                    }

                    if (!res.success) {
                        reply('Invalid user.')
                        return;
                    }

                    getUser(client).then(user => {
                        const tag = user.username + '#' + user.discriminator

                        const did = user.ID().toString()

                        if (!res.discordID) {
                            reply('No Discord ID found.\nPlease set your full discord username `' + tag + '` in your forum settings: <https://forum.sinusbot.com/account/account-details>')
                            return;
                        }

                        if (!tag || tag !== res.discordID) {
                            reply('Your username `' + tag + '` does not match `' + res.discordID + '`.')
                            return;
                        }

                        if (res.groups.length === 0) {
                            reply('You don\'t have any groups in the forum :hatching_chick:')
                        }

                        engine.log('roles: ' + res.groups.join(', '))

                        let roles = [];
                        if (res.groups.includes('Team-Mitglied')) {
                            roles.push(':hammer: Staff')
                            //addRole(client, '152974705953865728')
                        }
                        if (res.groups.includes('Developer')) {
                            roles.push(':floppy_disk: Developer')
                            //addRole(client, '454967235157426178')
                        }
                        if (res.groups.includes('Moderating')) {
                            roles.push(':hammer: Moderator')
                            //addRole(client, '531495313291083802')
                        }
                        if (res.groups.includes('VIP')) {
                            roles.push(':star: VIP')
                            addRole(client, '454965825317896193')
                        }
                        if (res.groups.includes('Tier III')) {
                            roles.push(':heart: Tier III')
                            addRole(client, '681228347065499899')
                        }
                        if (res.groups.includes('Tier II')) {
                            roles.push(':heart: Tier II')
                            addRole(client, '681228203096145996')
                        }
                        if (res.groups.includes('Tier I')) {
                            roles.push(':heart: Tier I')
                            addRole(client, '624933507260612608')
                        }
                        if (res.groups.includes('Donor++')) {
                            roles.push(':heart: Donor++')
                            addRole(client, '454967925544321034')
                        }
                        if (res.groups.includes('Donor')) {
                            roles.push(':heart: Donor')
                            addRole(client, '452456955391377409')
                        }
                        if (res.groups.includes('Contributor')) {
                            roles.push('Contributor')
                            addRole(client, '472340215113973772')
                        }
                        if (res.groups.includes('Insider')) {
                            roles.push('Insider')
                            addRole(client, '452456498300452877')
                        }
                        if (config.api_forum.startsWith("https://forum.sinusbot.com/")) {
                            const sinusbotModsJSON = '{"856780995629154305": "https://forum.sinusbot.com/members/lala-sabathil.656/", "100230152528617472": "https://forum.sinusbot.com/members/jniklas2.2885/", "290893007044083714": "https://forum.sinusbot.com/members/rotherpanter.61354/"}'
                            const sinusbotMods = JSON.parse(sinusbotModsJSON)
                            if(sinusbotMods[did] != undefined && sinusbotMods[did] != null) {
                                roles.push(':hammer: Moderator')
                                addRole(client, '531495313291083802')
                                reply("Your account " + sinusbotMods[did] + " was identified as Moderator")
                            }
                        }

                        const len = roles.length
                        if (len !== 0) {
                            reply(`Welcome ${client.getURL()}! :slight_smile:
Added ${len} role${len == 1 ? '' : 's'} from account ${id}:\n${roles.join('\n')}`)
                            engine.log(`${client.nick()} (${client.uid()}) synced roles from ${id}: ${roles.join()}`)
                        } else {
                            reply('You don\'t have any groups in the forum that can be synced :confused:')
                        }
                    })
                });
            })
        
        command.createCommand('purge')
            .forcePrefix('!')
            .addArgument(command.createArgument('int').setName('count'))
            .exec((client, args, /** @type {(message: string)=>void} */ reply, ev) => {
                if(isMod(client)) {
                    if(!args.count) {
                        reply(`Missing parameter *count*`)
                        ev.message.delete()
                        return
                    } else {
                        deleteMessages(ev.message, count)
                    }
                } else {
                    // This command does not exist
                   return;
                }
                ev.message.delete()
            })
    })
    
    function deleteMessages(msg, count) {
        const mid = msg.ID()
        const channel = msg.channel()        
        let messages = channel.getMessages({ before: mid, limit: count}, (err, msgarr) => {
            if(err) {
                engine.log(err)
                return false
            }
            try {
                msgarr.forEach(message => message.delete())
            } catch (error) {
                engine.log(error)
                return false
            }
            return true
        });
    }
    
    function isMod(client) {
        if(client.getServerGroups().includes('531495313291083802')) {
            return true
        } else {
            return false
        }
    }

    /**
     * Gets a user object.
     * @param {Client} client Client
     * @return {Promise<object>}
     */
    function getUser(client) {
        const id = client.uid().split('/')[1]
        return discord('GET', `/users/${id}`, null, true)
    }

    /**
     * Gets a user object.
     * @param {Client} client Client
     * @param {string} roleID Role ID
     * @return {Promise<object>}
     */
    function addRole(client, roleID) {
        const ids = client.uid().split('/')
        return discord('PUT', `/guilds/${ids[0]}/members/${ids[1]}/roles/${roleID}`, null, false)
    }

    /**
     * Executes a discord API call
     * @param {string} method http method
     * @param {string} path path
     * @param {object} [data] json data
     * @param {boolean} [repsonse] `true` if you're expecting a json response, `false` otherwise
     * @return {Promise<object>}
     * @author Jonas Bögle
     * @license MIT
     */
    function discord(method, path, data, repsonse = true) {
        //engine.log(`${method} ${path}`)

        return new Promise((resolve, reject) => {
            backend.extended().rawCommand(method, path, data, (err, data) => {
                if (err) return reject(err)
                if (repsonse) {
                    let res
                    try {
                        res = JSON.parse(data)
                    } catch (err) {
                        return reject(err)
                    }

                    if (res === undefined) {
                        return reject('Invalid Response')
                    }

                    return resolve(res)
                }
                resolve()
            })
        })
    }
})
