const logger = require('../../loaders/logger')

class Anime {
  constructor(Model) {
    this.Model = Model
  }
  async insertSeries(form) {
    logger.silly(`Series inserted: ` + JSON.stringify(form))

    const model = new this.Model(form)

    model.items = []
    await model.save()
  }
  async isSeriesExist(name) {
    const Model = this.Model

    const count = await Model.countDocuments({ name: name })

    return !!count
  }

  async insertItem(form) {
    logger.silly(`Item inserted: ` + JSON.stringify(form))

    const Model = this.Model

    Model.findOne({ name: form.name }, async (err, model) => {
      model.items.push(form.info)
      await model.save()
    })
  }
  async isItemExist(form) {
    const Model = this.Model

    const Items = await Model.findOne({ name: form.name })

    if (!Items) {
      return false
    }

    for (let i = 0; i < Items.items.length; i++) {
      if (Items.items[i].hash === form.info.hash) {
        return true
      }
    }
    return false
  }
  async updateSeriesInfo(form) {
    const Model = this.Model

    await Model.findOneAndUpdate({ name: form.name }, form)
  }
  async selectNameToRetrieve(fileName) {
    const titleField = await this.Model.findOne({ name: fileName }).select([
      'title',
    ])

    return titleField.title.as || fileName
  }
}
module.exports = Anime
