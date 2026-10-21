// Publication authorization and test evidence are intentionally separate.
export function downloadsAllowed(config) {
  return config.downloadsEnabled === true &&
    (config.hostingVerified === true || config.releaseApproval === 'user_authorized');
}
