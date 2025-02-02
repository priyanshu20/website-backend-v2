const { FRONTEND_URL, PARTICIPANT_URL } = require("../config");
const { toTitleCase } = require("./helpers");

const getReceiver = name => {
	if (name) {
		return toTitleCase(String(name).trim().split(" ")[0]);
	}
	return "";
};

const getFullHTML = (content, name) => {
	return `<html>

    <body>
        <div style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;width:100%!important;height:100%;line-height:1.6em;background-color:#f6f6f6;margin:0"
            bgcolor="#f6f6f6">
            <table
                style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;width:100%;background-color:#f6f6f6;margin:0"
                bgcolor="#f6f6f6">
                <tbody>
                    <tr
                        style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                        <td style="box-sizing:border-box;vertical-align:top;margin:0" valign="top"></td>
                        <td width="600"
                            style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;vertical-align:top;display:block!important;max-width:600px!important;clear:both!important;margin:0 auto"
                            valign="top">
                            <div
                                style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;max-width:600px!important;display:block;margin:0 auto;padding:20px">
                                <table width="100%" cellpadding="0" cellspacing="0"
                                    style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;border-radius:6px;background-color:#fff;margin:0"
                                    bgcolor="#fff">
                                    <tbody>
                                        <tr
                                            style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                                            <td style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:16px;vertical-align:top;font-weight:500;margin:0;padding:40px 40px 0 40px"
                                                valign="top"><img align="none"
                                                    src="https://drive.google.com/uc?export=view&id=1nj-6ynGsbYz4FH1RrYypPTMkhnocl3lO"
                                                    alt="DSC Logo"
                                                    style="widows:212px;height:40px;margin:0" width="468.8" height="38.5"
                                                    class="CToWUd"></td>
                                        </tr>
                                        <tr
                                            style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                                            <td style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;vertical-align:top;margin:0;padding:20px 40px 40px 40px"
                                                valign="top" colspan="2">
                                                <table width="100%" cellpadding="0" cellspacing="0"
                                                    style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                                                    <tbody>
                                                        <tr
                                                            style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                                                            <td style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:16px;line-height:24px;vertical-align:top;margin:0;word-wrap:break-word"
                                                                valign="top">Hi ${getReceiver(
																	name
																)}<br><br>Greetings from Developer Student Circuit KIET!<br /><br />${content}<br /><br />
                                                                    Feel free to drop us an email at
                                                                    <a
                                                                        style="font-weight: 700; color: #0850fd; text-decoration: none"
                                                                        href="mailto:dsckiet@gmail.com"
                                                                        >dsckiet@gmail.com </a
                                                                    >in case of any issues. <br /><br />
                                                                    Regards<br />
                                                                    Team DSCKIET
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div
                                    style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;clear:both;color:#999;margin:0;padding:20px 40px">
                                    <table width="100%"
                                        style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                                        <tbody>
                                            <tr
                                                style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:14px;margin:0">
                                                <td style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:12px;vertical-align:top;color:#888;margin:0"
                                                    valign="top">
                                                    <div><span class="il">Developer Student Circuit KIET</span></div><a href="mailto:dsckiet@gmail.com"
                                                        style="font-family:Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',sans-serif;box-sizing:border-box;font-size:12px;color:#888!important;text-decoration:underline!important;margin:0;display:block"
                                                        target="_blank"
                                                        data-saferedirecturl="https://www.google.com/url?q=mailto:dsckiet@gmail.com">Drop
                                                        us a query</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </td>
                        <td style="box-sizing:border-box;vertical-align:top;margin:0" valign="top"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>

    </html>`;
};

module.exports.getMailTemplate = (data, type) => {
	let templates = {
		"login-creds": {
			subject: `Portal Credentials for ${data.name} | DSC KIET`,
			html: getFullHTML(
				`
            <br/>
            You have been registered as a ${data.role} on DSC KIET
            Portal. Here are your login
            credentials:<br /><b >${data.email}</b><br /><b>${
					data.password
				}</b><br/><br/>
                Visit the portal at ${
					data.role === "Participant" ? PARTICIPANT_URL : FRONTEND_URL
				}, Change your password and update your profile details.<br/><br/>Thanks and regards<br/>Team DSCKIET<br/>`,
				data.name
			)
		},
		"reset-pwd-link": {
			subject: "Password reset request | DSC KIET",
			html: getFullHTML(
				`Someone (hopefully you) has requested a password reset for
                this account on DSC KIET Portal. Here is the reset
                link:<br /><b>${data.link}</b><br />This link is valid for 1
                hour only.If you did not requested this reset, you can
                simply ignore this email, your account will remain
                untouched`,
				data.name
			)
		},
		"reset-pwd-success": {
			subject: "Password reset success | DSC KIET",
			html: getFullHTML(
				`Your password has been successfully reset.
                If you did not triggered this action, please contact us at
                <a style="font-weight:700;color:#0850fd;text-decoration:none" href="mailto:dsckiet@gmail.com">dsckiet@gmail.com</a>`,
				data.name
			)
		},
		"change-pwd-success": {
			subject: "Password change success | DSC KIET",
			html: getFullHTML(
				`Your password has been successfully changed.
                If you did not triggered this action, please contact us at
                <a style="font-weight:700;color:#0850fd;text-decoration:none" href="mailto:dsckiet@gmail.com">dsckiet@gmail.com</a>`,
				data.name
			)
		},
		"event-registered": {
			subject: "Event registration success | DSC KIET",
			html: getFullHTML(
				`Thank you for registering in the event - <strong> ${
					data.event ? data.event.title : ""
				}</strong>.
                <br/>
                Further information about the event will be shared through this channel.`,
				data.name
			)
		},
		"subscriber-welcome": {
			subject: "Thanks for subscribing! | DSC KIET",
			html: getFullHTML(
				`Thank you for registering subscribing to the newsletter of DSC KIET. Any and all further information about events will be conveyed through this channel.`
			)
		},
		"rsvp-confirmed-wb": {
			subject: "Confirmation | Web Bootcamp | DSC KIET",
			html: getFullHTML(
				`Your RSVP is confirmed for the upcoming <b>Web Development Bootcamp</b>. <br />
                <br />
                Event details:<br />
                Timing:
                <b>21-26 Oct 2021 | 5:00 PM</b><br />
                Venue:
                <b>Lab-2, 5th Floor, E-Block, KIET Group Of Institutions</b><br /><br />
                There are a few things you need to keep in mind:<br />
                <li>
                    Bring your laptops, a notebook, and a pen if you need to note some points.
                    make sure to have
                    <a
                        style="font-weight: 700; color: #0850fd; text-decoration: none"
                        href="https://code.visualstudio.com/download"
                        >VS Code </a
                    >with
                    <b>Prettier</b>
                    and
                    <b>Live Server</b>
                    extensions and
                    <a
                        style="font-weight: 700; color: #0850fd; text-decoration: none"
                        href="https://nodejs.org/en/download/"
                        >Node.js (LTS version)</a
                    >
                    installed in your laptop.
                </li>
                <li>Make sure you mark your attendance on all days of the bootcamp.</li>
                <li>
                    E-certificates and swags will be given to the participants, who complete the
                    bootcamp with excellence.
                </li>
                <li>
                    If someone is found committing an indiscipline act or damaging college
                    property during the bootcamp would have serious actions taken against them.
                </li>
                <li>
                    Visit our events portal at
                    <a
                        href="https://events.dsckiet.com"
                        style="font-weight: 700; color: #0850fd; text-decoration: none"
                        >events.dsckiet.com</a
                    >
                    and login with credentials sent to you via email for more information.
                </li>
                <li>Make sure to carry your masks and sanitizers.</li>
                <br />
                We are excited to host you, don't forget to mark your presence.
                `,
				data.name
			)
		}
	};
	return templates[type];
};
