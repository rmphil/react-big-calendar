import { views } from './utils/constants'
import Month from './Month'
import Day from './Day'
import Week from './Week'
import WorkWeek from './WorkWeek'
import Agenda from './Agenda'
import List from './List'

const VIEWS = {
  [views.MONTH]: Month,
  [views.WEEK]: Week,
  [views.WORK_WEEK]: WorkWeek,
  [views.DAY]: Day,
  [views.AGENDA]: Agenda,
  [views.LIST]: List,
}

export default VIEWS
