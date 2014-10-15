/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

var Cu = Components.utils;
var Ci = Components.interfaces;

Cu.import("resource://gre/modules/Services.jsm");

function logStatus(m) {
  Services.console.logStringMessage("DisableSSLv3: " + m);
}

function startup(aData, aReason) {
  let sslMinPref = "security.tls.version.min";
  // If the current pref value is already greater or equal than 1 (i.e. SSLv3
  // disabled), we have nothing to do here. This can happen either if the user
  // has already chosen a more restrictive value (i.e. >= 1) with a user pref,
  // or this is a build that disables SSLv3 by default.
  try {
    if (Services.prefs.getIntPref(sslMinPref) >= 1) {
      logStatus("SSLv3 already disabled, doing nothing");
      return;
    }
  } catch (ex) {
    logStatus("Exception thrown reading pref: " + ex);
  }

  // Otherwise, clear any possible user prefs, and set the pref on the default
  // branch. Clearing the user pref ensures that no invalid values override our
  // default, and setting it on the default branch ensures that this value
  // doesn't persist when the addon is uninstalled (and the browser restarted).
  logStatus("Disabling SSLv3");
  try {
    Services.prefs.clearUserPref(sslMinPref);
    let defaultPrefB = Services.prefs.getDefaultBranch("");
    defaultPrefB.setIntPref(sslMinPref, 1);
  } catch (ex) {
    logStatus("Exception thrown setting pref: " + ex);
  }
}

function shutdown(aData, aReason) { }

function install(aData, aReason) { }

function uninstall(aData, aReason) { }