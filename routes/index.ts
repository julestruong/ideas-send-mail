﻿
const Briq = require('briq-api').Client;
const briq = new Briq(process.env.BRIQ_ACCESS_TOKEN);
import express = require('express');
const router = express.Router();
const _ = require('lodash');
const mailjet = require('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)



router.post('/', (req: express.Request, res: express.Response) => {
    const ladder = req.body;
    const promises = []

    ladder.map((person, index) => {
        let amount = 100;
        switch(index) {
            case 0: amount = 400;break;
            case 1: amount = 300;break;
            case 2: amount = 200;break;
            default: break;
        }

        const transaction = {
            "amount": amount,
            "app": "give",
            "comment": "Idée du vendredi - " + person.idea,
            "to": person.username,
        };

        promises.push(
            briq.organization(process.env.ORGANIZATION).createTransaction(transaction)
        );
    });


    Promise.all(promises).then(result => {
        briq.organization(process.env.ORGANIZATION).users().then(users => {
            let to = [] 
            _.forEach(users, function(user) {
                to.push({
                    "Email": user.email,
                    "Name": user.username,
                });
            });
console.log(to);
            to = [{
                "Email": "jules.truong.perso@gmail.com",
            }];

            const request = mailjet
            .post("send", {'version': 'v3.1'})
            .request({
                "Messages":[
                    {
                        "From": {
                            "Email": "cib@bureauxapartager.com",
                            "Name": "Comité"
                        },
                        "To":to,
                        "Subject": "Les idées du vendredi !",
                        "HTMLPart": `<!DOCTYPE html>
                        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                        <head>
                            <meta charset="utf-8"> <!-- utf-8 works for most cases -->
                            <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
                            <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
                            <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
                            <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
                        
                            <!-- Web Font / @font-face : BEGIN -->
                            <!-- NOTE: If web fonts are not required, lines 10 - 27 can be safely removed. -->
                        
                            <!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->
                            <!--[if mso]>
                                <style>
                                    * {
                                        font-family: sans-serif !important;
                                    }
                                </style>
                            <![endif]-->
                        
                            <!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->
                            <!--[if !mso]><!-->
                            <!-- insert web font reference, eg: <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'> -->
                            <!--<![endif]-->
                        
                            <!-- Web Font / @font-face : END -->
                        
                            <!-- CSS Reset : BEGIN -->
                            <style>
                        
                                /* What it does: Remove spaces around the email design added by some email clients. */
                                /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
                                html,
                                body {
                                    margin: 0 auto !important;
                                    padding: 0 !important;
                                    height: 100% !important;
                                    width: 100% !important;
                                }
                        
                                /* What it does: Stops email clients resizing small text. */
                                * {
                                    -ms-text-size-adjust: 100%;
                                    -webkit-text-size-adjust: 100%;
                                }
                        
                                /* What it does: Centers email on Android 4.4 */
                                div[style*="margin: 16px 0"] {
                                    margin: 0 !important;
                                }
                        
                                /* What it does: Stops Outlook from adding extra spacing to tables. */
                                table,
                                td {
                                    mso-table-lspace: 0pt !important;
                                    mso-table-rspace: 0pt !important;
                                }
                        
                                /* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
                                table {
                                    border-spacing: 0 !important;
                                    border-collapse: collapse !important;
                                    table-layout: fixed !important;
                                    margin: 0 auto !important;
                                }
                                table table table {
                                    table-layout: auto;
                                }
                        
                                /* What it does: Uses a better rendering method when resizing images in IE. */
                                img {
                                    -ms-interpolation-mode:bicubic;
                                }
                        
                                /* What it does: A work-around for email clients meddling in triggered links. */
                                *[x-apple-data-detectors],  /* iOS */
                                .x-gmail-data-detectors,    /* Gmail */
                                .x-gmail-data-detectors *,
                                .aBn {
                                    border-bottom: 0 !important;
                                    cursor: default !important;
                                    color: inherit !important;
                                    text-decoration: none !important;
                                    font-size: inherit !important;
                                    font-family: inherit !important;
                                    font-weight: inherit !important;
                                    line-height: inherit !important;
                                }
                        
                                /* What it does: Prevents Gmail from displaying an download button on large, non-linked images. */
                                .a6S {
                                    display: none !important;
                                    opacity: 0.01 !important;
                                }
                                /* If the above doesn't work, add a .g-img class to any image in question. */
                                img.g-img + div {
                                    display: none !important;
                                }
                        
                                /* What it does: Prevents underlining the button text in Windows 10 */
                                .button-link {
                                    text-decoration: none !important;
                                }
                        
                                /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
                                /* Create one of these media queries for each additional viewport size you'd like to fix */
                                /* Thanks to Eric Lepetit @ericlepetitsf) for help troubleshooting */
                                @media only screen and (min-device-width: 375px) and (max-device-width: 413px) { /* iPhone 6 and 6+ */
                                    .email-container {
                                        min-width: 375px !important;
                                    }
                                }
                        
                                /* What it does: Forces Gmail app to display email full width */
                                u ~ div .email-container {
                                    min-width: 100vw;
                                }
                        
                            </style>
                            <!-- CSS Reset : END -->
                        
                            <!-- Progressive Enhancements : BEGIN -->
                            <style>
                        
                            /* What it does: Hover styles for buttons */
                            .button-td,
                            .button-a {
                                transition: all 100ms ease-in;
                            }
                            .button-td:hover,
                            .button-a:hover {
                                background: #555555 !important;
                                border-color: #555555 !important;
                            }
                        
                            /* Media Queries */
                            @media screen and (max-width: 480px) {
                        
                                /* What it does: Forces elements to resize to the full width of their container. Useful for resizing images beyond their max-width. */
                                .fluid {
                                    width: 100% !important;
                                    max-width: 100% !important;
                                    height: auto !important;
                                    margin-left: auto !important;
                                    margin-right: auto !important;
                                }
                        
                                /* What it does: Forces table cells into full-width rows. */
                                .stack-column,
                                .stack-column-center {
                                    display: block !important;
                                    width: 100% !important;
                                    max-width: 100% !important;
                                    direction: ltr !important;
                                }
                                /* And center justify these ones. */
                                .stack-column-center {
                                    text-align: center !important;
                                }
                        
                                /* What it does: Generic utility class for centering. Useful for images, buttons, and nested tables. */
                                .center-on-narrow {
                                    text-align: center !important;
                                    display: block !important;
                                    margin-left: auto !important;
                                    margin-right: auto !important;
                                    float: none !important;
                                }
                                table.center-on-narrow {
                                    display: inline-block !important;
                                }
                        
                                /* What it does: Adjust typography on small screens to improve readability */
                                .email-container p {
                                    font-size: 17px !important;
                                }
                            }
                            @import url('https://fonts.googleapis.com/css?family=Abhaya+Libre');
                            </style>
                            <!-- Progressive Enhancements : END -->
                        
                            <!-- What it does: Makes background images in 72ppi Outlook render at correct size. -->
                            <!--[if gte mso 9]>
                            <xml>
                                <o:OfficeDocumentSettings>
                                    <o:AllowPNG/>
                                    <o:PixelsPerInch>96</o:PixelsPerInch>
                                </o:OfficeDocumentSettings>
                            </xml>
                            <![endif]-->
                        
                        </head>
                        <body width="100%" bgcolor="#fff" style="margin: 0; mso-line-height-rule: exactly;">
                            <center style="width: 100%; background: #fff; text-align: left;">
                        
                                <!-- Visually Hidden Preheader Text : BEGIN -->
                                <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                                    Les meilleurs idées de la semaine
                                </div>
                                <!-- Visually Hidden Preheader Text : END -->
                        
                                <!--
                                    Set the email width. Defined in two places:
                                    1. max-width for all clients except Desktop Windows Outlook, allowing the email to squish on narrow but never go wider than 680px.
                                    2. MSO tags for Desktop Windows Outlook enforce a 680px width.
                                    Note: The Fluid and Responsive templates have a different width (600px). The hybrid grid is more "fragile", and I've found that 680px is a good width. Change with caution.
                                -->
                                <div style="max-width: 680px; margin: auto;" class="email-container">
                                    <!--[if mso]>
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="680" align="center">
                                    <tr>
                                    <td>
                                    <![endif]-->
                        
                                    <!-- Email Header : BEGIN -->
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;">
                                        <tr>
                                            <td style="padding: 20px 0; text-align: center">
                                                <img src="https://img15.hostingpics.net/pics/197373logobap.png" width="200" height="50" alt="alt_text" border="0" style="height: auto; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555;">
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Email Header : END -->
                        
                                    <!-- Email Body : BEGIN -->
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;" class="email-container">
                                        <tr>
                                            <td style="padding: 0px 40px 20px; text-align: center;">
                                                <h1 style="margin: 0; font-family: 'Abhaya Libre'; font-size: 33px; line-height: 125%; color: #333333; font-weight: normal;"  >Les idées de la semaine - 1er décembre 2017</h1>
                                            </td>
                                        </tr>
                                        <!-- Hero Image, Flush : BEGIN -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="center">
                                                <img src="https://img15.hostingpics.net/pics/666633creativity.png" width="680" height="" alt="alt_text" border="0" align="center" style="width: 100%; max-width: 480px; height: auto; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555; margin: auto;" class="fluid g-img">
                                            </td>
                                        </tr>
                                        <!-- Hero Image, Flush : END -->
                        
                                        <!-- 1 Column Text + Button : BEGIN -->
                                        <!-- <tr>
                                            <td bgcolor="#ffffff">
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <tr>
                                                        <td style="padding: 0 40px 40px; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555;">
                                                            <!-- Button : BEGIN -->
                                                            <!-- <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto;">
                                                                <tr>
                                                                    <td style="border-radius: 3px; background: #222222; text-align: center;" class="button-td">
                                                                        <a href="http://www.google.com" style="background: #222222; border: 15px solid #222222; font-family: sans-serif; font-size: 13px; line-height: 110%; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;" class="button-a">
                                                                            <span style="color:#ffffff;" class="button-link">&nbsp;&nbsp;&nbsp;&nbsp;A Button&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            </table> -->
                                                            <!-- Button : END -->
                                                        <!-- </td>
                                                    </tr>
                        
                                                </table>
                                            </td>
                                        </tr> -->
                                        <!-- 1 Column Text + Button : END -->
                        
                                        <!-- Background Image with Text : BEGIN -->
                                        <tr>
                                            <!-- Bulletproof Background Images c/o https://backgrounds.cm -->
                                            <td bgcolor="#1a2035" valign="middle" style="text-align: center; background-position: center center !important; background-size: cover !important;">
                                                <!--[if gte mso 9]>
                                                <v:image xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="border: 0; display: inline-block; width: 680px; height: 180px;"/>
                                                <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="border: 0; display: inline-block; position: absolute; width: 680px; height: 180px;">
                                                <v:fill opacity="0%" color="#222222" />
                                                <![endif]-->
                                                <div>
                                                    <!--[if mso]>
                                                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" width="500">
                                                    <tr>
                                                    <td align="center" valign="top" width="500">
                                                    <![endif]-->
                                                    <!-- <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="max-width:680px; margin: auto;">
                                                        <tr>
                                                            <td valign="middle" style="text-align: center; padding: 40px 20px; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #fff;">
                                                                <p style="margin: 0;">"Le réalisateur d'une idée n'est pas forcément celui qui la donne" ©Alteresco - 2016</p>
                                                            </td>
                                                        </tr>
                                                    </table> -->
                                                    <!--[if mso]>
                                                    </td>
                                                    </tr>
                                                    </table>
                                                    <![endif]-->
                                                </div>
                                                <!--[if gte mso 9]>
                                                </v:fill>
                                                </v:rect>
                                                </v:image>
                                                <![endif]-->
                                            </td>
                                        </tr>
                                        <!-- Background Image with Text : END -->
                        
                                        <!-- 3 Even Columns : BEGIN -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="center" height="100%" valign="top" width="100%" style="padding: 10px 0;">
                                                <!--[if mso]>
                                                <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" width="660">
                                                <tr>
                                                <td align="center" valign="top" width="660">
                                                <![endif]-->
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="max-width:660px;">
                                                    <tr>
                                                        <td align="center" valign="top" style="font-size:0;">
                                                            <!--[if mso]>
                                                            <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" width="660">
                                                            <tr>
                                                            <td align="left" valign="top" width="220">
                                                            <![endif]-->
                                                            <div style="display:inline-block; margin: 0 -2px; max-width:33.33%; min-width:220px; vertical-align:top; width:100%;" class="stack-column">
                                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                                    <tr>
                                                                        <td style="padding: 10px 10px;">
                                                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px;text-align: left;">
                                                                                <tr>
                                                                                    <td><br><br><br><br>
                                                                                        <img src="https://img15.hostingpics.net/pics/885510bronze.png" width="200" height="" border="0" alt="alt_text" class="center-on-narrow" style="width: 100%; max-width: 200px; height: auto; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555;">
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="text-align: center;">
                                                                                    <td style="font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555; padding-top: 10px;" class="stack-column-center">
                                                                                        <h3>Jules</h3>
                                                                                        <p style="margin: 0;">Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
                                                                                        <h5>100 briqs</h3>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </div>
                                                            <!--[if mso]>
                                                            </td>
                                                            <td align="left" valign="top" width="220">
                                                            <![endif]-->
                                                            <div style="display:inline-block; margin: 0 -2px; max-width:33.33%; min-width:220px; vertical-align:top; width:100%;" class="stack-column">
                                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                                    <tr>
                                                                        <td style="padding: 10px 10px;">
                                                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px;text-align: left;">
                                                                                <tr>
                                                                                    <td>
                                                                                        <img src="https://img15.hostingpics.net/pics/780468gold.png" width="200" height="" border="0" alt="alt_text" class="center-on-narrow" style="width: 100%; max-width: 200px; height: auto; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555;">
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="text-align: center;">
                                                                                    <td style="font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555; padding-top: 10px;" class="stack-column-center">
                                                                                        <h3>Ruben</h3>
                                                                                        <p style="margin: 0;">Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
                                                                                        <h5>100 briqs</h3>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </div>
                                                            <!--[if mso]>
                                                            </td>
                                                            <td align="left" valign="top" width="220">
                                                            <![endif]-->
                                                            <div style="display:inline-block; margin: 0 -2px; max-width:33.33%; min-width:220px; vertical-align:top; width:100%;" class="stack-column">
                                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                                    <tr>
                                                                        <td style="padding: 10px 10px;">
                                                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px;text-align: left;">
                                                                                <tr>
                                                                                    <td><br><br>
                                                                                        <img src="https://img15.hostingpics.net/pics/723346silver.png" width="200" height="" border="0" alt="alt_text" class="center-on-narrow" style="width: 100%; max-width: 200px; height: auto; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555;">
                                                                                    </td>
                                                                                </tr>
                                                                                <tr style="text-align: center;">
                                                                                    <td style="font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555; padding-top: 10px;" class="stack-column-center">
                                                                                        <h3>Jeremie</h3>
                                                                                        <p style="margin: 0;">Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
                                                                                        <h5>100 briqs</h3>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </div>
                                                            <!--[if mso]>
                                                            </td>
                                                            </tr>
                                                            </table>
                                                            <![endif]-->
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]>
                                                </td>
                                                </tr>
                                                </table>
                                                <![endif]-->
                                            </td>
                                        </tr>
                                        <!-- 3 Even Columns : END -->
                        
                                  
                                        <!-- Clear Spacer : BEGIN -->
                                        <tr>
                                            <td aria-hidden="true" height="40" style="font-size: 0; line-height: 0;">
                                                &nbsp;
                                            </td>
                                        </tr>
                                        <!-- Clear Spacer : END -->
                        
                                        <!-- 1 Column Text : BEGIN -->
                                        <tr>
                                            <td bgcolor="#ffffff">
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <tr>
                                                        <td style="padding: 40px; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555;">
                                                            <p style="margin: 0 0 10px 0;">Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent laoreet malesuada cursus. Maecenas scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut&nbsp;erat.</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <!-- 1 Column Text : END -->
                        
                                    </table>
                                    <!-- Email Body : END -->
                        
                                    <!--[if mso]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
                                </div>
                        
                                <!-- Full Bleed Background Section : BEGIN -->
                                <table role="presentation" bgcolor="#1a2035" cellspacing="0" cellpadding="0" border="0" align="center" width="100%">
                                    <tr>
                                        <td valign="top" align="center">
                                            <div style="max-width: 680px; margin: auto;" class="email-container">
                                                <!--[if mso]>
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="680" align="center">
                                                <tr>
                                                <td>
                                                <![endif]-->
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                    <tr>
                                                        <td style="padding: 40px; text-align: left; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #ffffff;">
                                                            <p style="margin: 0;">Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent laoreet malesuada cursus. Maecenas scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut&nbsp;erat.</p>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]>
                                                </td>
                                                </tr>
                                                </table>
                                                <![endif]-->
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                <!-- Full Bleed Background Section : END -->
                        
                            </center>
                        </body>
                        </html>`
                    }
                ]
            }).then((res) => console.log(res))
            .catch((err) => console.log(err));
            res.json(result);
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

export default router;
