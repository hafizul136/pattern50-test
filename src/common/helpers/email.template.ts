export class EmailTemplate {

  static getForgetPasswordEmailHtml(firstName: string, lastName: string, resetPasswordLink: string): string {
    return `
    <!DOCTYPE html>\r\n    <html lang=\"en\">\r\n    <head>\r\n      <meta charset=\"UTF-8\">\r\n      <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n      <meta http-equiv=\"Content-Type\" content=\"text\/html charset=UTF-8\" \/>\r\n      <link rel=\"preconnect\" href=\"https:\/\/fonts.googleapis.com\">\r\n    <link rel=\"preconnect\" href=\"https:\/\/fonts.gstatic.com\" crossorigin>\r\n    <link href=\"https:\/\/fonts.googleapis.com\/css2?family=Roboto:wght@400;500;700&display=swap\" rel=\"stylesheet\">\r\n      <title>Property Invitation<\/title>\r\n    <\/head>\r\n    <body style=\"background-color: #ffffff; font-family: 'Roboto', sans-serif !important; width: 640px; margin: auto; position: relative; top: 75px\">\r\n        <table\r\n      style=\"margin: auto; padding-left: 32px; width:550px;\"\r\n      role=\"presentation\"\r\n      border=\"0\"\r\n      cellspacing=\"0\"\r\n      width=\"100%\"\r\n    >\r\n      <tr>\r\n        <td style=\"padding: 40px 0 72px 0px;\">\r\n          <img\r\n            style=\"max-width: 134px; width: 100%;\"\r\n            src=\"https:\/\/i.ibb.co\/LZ7pnkt\/Main-Logo.png\"\r\n          \/>\r\n        <\/td>\r\n      <\/tr>\r\n    <\/table>\r\n        <table style=\"background-color: #F8F9FB; width: 500px; margin: auto; padding: 32px; border-radius: 8px\">\r\n          <tr>\r\n            <td colspan=\"5\" style=\"font-weight: bold; padding-bottom: 20px; font-size: 20px;color:#121A26;\">Reset Password Request.<\/td>\r\n          <\/tr>\r\n          <tr>\r\n            <td colspan=\"5\" style=\"padding-bottom: 20px;color:#384860;\">\r\n              Hello ${firstName} ${lastName},\r\n              Link: ${resetPasswordLink},\r\n              Link <a style=\"cursor: pointer\" href=\"${resetPasswordLink}\" target=\"_blank\" >Reset<\/a>\r\n            <\/td>\r\n          <\/tr>\r\n          <tr>\r\n            <td colspan=\"5\" style=\"padding-bottom: 20px;color:#384860;\">\r\n              We've received a request to reset your password.\r\n            <\/td>\r\n            <tr>\r\n            <td colspan=\"5\" style=\"padding-bottom: 20px;color:#384860;\">\r\n              If you didn't make the request, just ignore this message. Otherwise, you can reset your password by clicking the button below.\r\n            <\/td>\r\n          <\/tr>\r\n          <tr>\r\n            <td colspan=\"5\" style=\"padding-bottom: 0px;color:#384860;\">\r\n              Thanks,\r\n            <\/td>\r\n          <\/tr>\r\n          <tr>\r\n            <td colspan=\"5\" style=\"padding-bottom: 20px;color:#384860;\">\r\n              Pattern50 Team\r\n            <\/td>\r\n          <\/tr>\r\n            <tr>\r\n              <td>\r\n                <a style=\"cursor: pointer\" href=\"{{resetPasswordLink}\" target=\"_blank\" >\r\n                  <button style=\"display: inline-block !important; background-color: #2969FF; color: white; padding: 10px 16px; border-radius: 6px; border: 0; cursor: pointer !important ;\">\r\n                    Reset your password\r\n                  <\/button>\r\n                <\/a>\r\n              <\/td>\r\n            <\/tr>\r\n        <\/table>\r\n        <table style=\"width: 500px; margin: 56px auto; padding: 0px;\">\r\n          <tr>\r\n            <td colspan=\"5\" style=\"padding-bottom: 20px; font-size: 14px; color:#858C95;\">Questions or FAQ? Contact us at <a style=\"color:#0C66E4; text-decoration:none;\" href=\"mailto:support@pattern50.com\">support@pattern50.com<\/a>. For more information about Pattern50, visit <a style=\"color:#0C66E4; text-decoration:none; cursor: pointer\" href=\"https:\/\/www.pattern50.com\">www.pattern50.com<\/a>.<\/td>\r\n          <\/tr>\r\n          <tr>\r\n            <td colspan=\"5\" style=\"padding-bottom: 24px; font-size:14px; color:#858C95;\">\u00A9 2024 Pattern50.<\/td>\r\n          <\/tr>\r\n        \r\n        <\/table>\r\n    <\/body>\r\n    <\/html>
    `;
  }
  static getForgetPasswordEmailHtml2(firstName: string, lastName: string, resetPasswordLink: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
      <title>Property Invitation</title>
    </head>
    <body style="background-color: #ffffff; font-family: 'Roboto', sans-serif !important; width: 640px; margin: auto; position: relative; top: 75px">
        <table
      style="margin: auto; padding-left: 32px; width:550px;"
      role="presentation"
      border="0"
      cellspacing="0"
      width="100%"
    >
      <tr>
        <td style="padding: 40px 0 72px 0px;">
          <img
            style="max-width: 134px; width: 100%;"
            src="https://i.ibb.co/LZ7pnkt/Main-Logo.png"
          />
        </td>
      </tr>
    </table>
        <table style="background-color: #F8F9FB; width: 500px; margin: auto; padding: 32px; border-radius: 8px">
          <tr>
            <td colspan="5" style="font-weight: bold; padding-bottom: 20px; font-size: 20px;color:#121A26;">Reset Password Request.</td>
          </tr>
          <tr>
            <td colspan="5" style="padding-bottom: 20px;color:#384860;">
              Hello ${firstName} ${lastName},
              Link: ${resetPasswordLink},
              Link <a style="cursor: pointer" href="${resetPasswordLink}" target="_blank" >Reset</a>
            </td>
          </tr>
          <tr>
            <td colspan="5" style="padding-bottom: 20px;color:#384860;">
              We've received a request to reset your password.
            </td>
            <tr>
            <td colspan="5" style="padding-bottom: 20px;color:#384860;">
              If you didn't make the request, just ignore this message. Otherwise, you can reset your password by clicking the button below.
            </td>
          </tr>
          <tr>
            <td colspan="5" style="padding-bottom: 0px;color:#384860;">
              Thanks,
            </td>
          </tr>
          <tr>
            <td colspan="5" style="padding-bottom: 20px;color:#384860;">
              Pattern50 Team
            </td>
          </tr>
            <tr>
              <td>
                <a style="cursor: pointer" href="{{resetPasswordLink}" target="_blank" >
                  <button style="display: inline-block !important; background-color: #2969FF; color: white; padding: 10px 16px; border-radius: 6px; border: 0; cursor: pointer !important ;">
                    Reset your password
                  </button>
                </a>
              </td>
            </tr>
        </table>
        <table style="width: 500px; margin: 56px auto; padding: 0px;">
          <tr>
            <td colspan="5" style="padding-bottom: 20px; font-size: 14px; color:#858C95;">Questions or FAQ? Contact us at <a style="color:#0C66E4; text-decoration:none;" href="mailto:support@pattern50.com">support@pattern50.com</a>. For more information about Pattern50, visit <a style="color:#0C66E4; text-decoration:none; cursor: pointer" href="https://www.pattern50.com">www.pattern50.com</a>.</td>
          </tr>
          <tr>
            <td colspan="5" style="padding-bottom: 24px; font-size:14px; color:#858C95;">© 2024 Pattern50.</td>
          </tr>
        
        </table>
    </body>
    </html>
    `;
  }
  static getPasswordResetSuccessEmailHtml(firstName: string, lastName: string): string {
    return `
        <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
      <title>Password Reset</title>
    </head>
    <body style="background-color: #f8f8fc; font-family: 'Roboto', sans-serif !important; width: 600px; margin: auto; position: relative; top: 75px">
        <table
      style="margin: 0 auto; padding: 20px 0;"
      role="presentation"
      border="0"
      cellspacing="0"
      width="100%"
    >
      <tr>
        <td align="center">
          <img
            style="max-width: 150px; width: 100%;"
            src="https://user-images.githubusercontent.com/78010933/199701990-130b8a0c-f1cc-4f1e-8b26-ae15374e9e00.png"
          />
        </td>
      </tr>
    </table>
        <table style="background-color: white; width: 500px; margin: auto; padding: 20px 30px;">
          <tr>
            <td colspan="5" style="font-weight: bold; padding-bottom: 20px">Password Reset Successful</td>
          </tr>
          <tr>
            <td colspan="5" style="padding-bottom: 20px">
              Hello ${firstName} ${lastName},
            </td>
          </tr>
          <tr>
            <td colspan="5" style="padding-bottom: 30px">
              Your password has been successfully changed.
            </td>
          <tr>
            <td colspan="5" style="padding-top: 20px">For more information about Charge OnSite visit</td>
          </tr>
          <tr>
            <td colspan="5" style="padding-top: 5px">
              <a href="${process.env.CLIENT_BASE_URL}" style="color: #2969FF">${process.env.CLIENT_BASE_URL}</a>
            </td>
          </tr>
        </table>
        <table style="background-color: white; width: 500px; margin: 30px auto; padding: 20px 30px;">
          <tr>
            <td colspan="5" style="padding-bottom: 0px !important; font-weight: bold">Facing any problem?</td>
          </tr>
          <tr>
            <td colspan="5" style="padding-top: 5px">Contact at <a href = "mailto:support@chargeonsite.com" style="color: #2969FF">support@chargeonsite.com</a></td>
          </tr>
      
        </table>
        <table style="text-align: center; margin-top: 30px; margin: auto">
                <tr>
                   <td>&nbsp;</td>
                </tr>
              </table>
    </body>
    </html>
    `;
  }
}
