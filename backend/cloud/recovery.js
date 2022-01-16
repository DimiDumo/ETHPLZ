Moralis.Cloud.define(
  'initiateRecovery',
  async ({ user, params }) => {
    const recoveryRequest = new RecoveryRequest(params.newSignerAddress, user)
    await recoveryRequest.save()
  },
  {
    requireUser: true,
    useMasterKey: true
  }
)
