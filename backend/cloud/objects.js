class RecoveryRequest extends Moralis.Object {
  constructor(newSignerAddress, user) {
    super('RecoveryRequest')
    this.set('newSignerAddress', newSignerAddress)
    this.set('forUser', user)
  }
}
