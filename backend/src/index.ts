// import type { Core } from '@strapi/strapi';

import { access } from "fs";

const purestConfig = {
  "feedforward": {
    "default": {
      "origin": "https://auth.feedforward-collective.com",
      "version": "v2",
      "path": "oauth/{version}/{path}",
      "headers": {
        "Authorization": "Bearer {auth}"
      }
    }
  },
  "feedforward-oidc": {
    "default": {
      "origin": "https://auth.feedforward-collective.com",
      "version": "v1",
      "path": "oidc/{version}/{path}",
      "headers": {
        "Authorization": "Bearer {auth}"
      }
    }
  }
};

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {
    strapi
      .plugin("users-permissions")
      .service("providers-registry")
      .add("feedforward", {
        icon: "",
        enabled: true,
        grantConfig: {
          /* Fun thing: the grantConfig only seems to be used if it doesn't exist in the DB, it's then created there and can only be changed there */
          key: "put_key_in_admin_panel",
          secret: "put_secret_in_admin_panel",
          /* At least for development: (changable later in admin panel) */
          callback: `http://localhost:3000/connect/discord/redirect`,
          scope: ["openid", "profile", "email", "urn:zitadel:iam:user:metadata", "urn:zitadel:iam:org:project:roles"],
          authorize_url: "https://auth.feedforward-collective.com/oauth/v2/authorize",
          access_url: "https://auth.feedforward-collective.com/oauth/v2/token",
          oauth: 2,
          scope_delimiter: " "
        },
        async authCallback({ accessToken, providers, purest }) {
          // Make a call to userinfo endpoint with accessToken to get user data
          //https://auth.feedforward-collective.com/oauth/v2/userinfo
          var feedforward;
          try {
            feedforward = await purest({provider: "feedforward-oidc", config: purestConfig})
              .get("userinfo")
              .auth(accessToken)
              .request();
          }
          catch (err) {
            throw new Error("Login flow failed. Please contact the site administrator.");            return null;
          }
          console.log("Feedforward userinfo response:", feedforward.body);
          // Example result:
          // {"sub":"327228358788124163","name":"cyan","given_name":"cyan","family_name":"-","locale":null,"updated_at":1751540698,"preferred_username":"cyanfr","email":"me@test.com","email_verified":true}
          return {
            email: feedforward.body.email,
            username: feedforward.body.preferred_username
          }
        },
      });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
