class Settings {
  constructor(Model) {
    this.model = Model
  }

  async getSetting(type) {
    const data = await this.model.findOne({ type }).exec()

    return data
  }
}

module.exports = Settings
