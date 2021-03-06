import { Incidents } from 'model/incidents'
import SNS from 'aws/sns'

export async function handle (event, context, callback) {
  try {
    const incidents = new Incidents()
    const incident = await incidents.lookup(event.params.incidentid)
    await incident.delete()

    await new SNS().notifyIncident(incident)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ValidationError':
        callback('Error: ' + error.message)
        break
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to delete the incident')
    }
  }
}
