// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: { 
    apiKey: "AIzaSyCGT_vBssIZWS2jrfCeQycd-GkF5orYjK8", 
    authDomain: "todos-5d5f6.firebaseapp.com", 
    databaseURL: "https://todos-5d5f6.firebaseio.com", 
    projectId: "todos-5d5f6", 
    storageBucket: "", 
    messagingSenderId: "827290518638" 
  }
};
