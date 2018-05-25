import PropTypes from 'prop-types'
import React from 'react'
import localizer from './localizer'
import message from './utils/messages'
import dates from './utils/dates'
import { navigate } from './utils/constants'
import { accessor as get } from './utils/accessors'
import { accessor, dateFormat, dateRangeFormat } from './utils/propTypes'
import { inRange } from './utils/eventLevels'
import { isSelected } from './utils/selection'

class List extends React.Component {
  static propTypes = {
    events: PropTypes.array,
    date: PropTypes.instanceOf(Date),
    length: PropTypes.number.isRequired,
    titleAccessor: accessor.isRequired,
    tooltipAccessor: accessor.isRequired,
    allDayAccessor: accessor.isRequired,
    startAccessor: accessor.isRequired,
    endAccessor: accessor.isRequired,
    eventPropGetter: PropTypes.func,
    selected: PropTypes.object,
    listDateFormat: dateFormat,
    listTimeFormat: dateFormat,
    listTimeRangeFormat: dateRangeFormat,
    culture: PropTypes.string,
    components: PropTypes.object.isRequired,
    messages: PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
    }),
  }

  static defaultProps = {
    length: 30,
  }

  render() {
    let { length, date, events, startAccessor } = this.props
    let end = dates.add(date, length, 'day')
    let range = dates.range(date, end, 'day')

    events = events.filter(event => inRange(event, date, end, this.props))
    events.sort((a, b) => +get(a, startAccessor) - +get(b, startAccessor))

    return (
      <div className="rbc-list-view">
        <div className="rbc-list-content">
          <div className="rbc-list-events">
            {range.map((day, idx) => this.renderDay(day, events, idx))}
          </div>
        </div>
      </div>
    )
  }

  renderDay = (day, events, dayKey) => {
    let {
      culture,
      components,
      titleAccessor,
      listDateFormat,
      eventPropGetter,
      startAccessor,
      endAccessor,
      selected,
    } = this.props

    const EventComponent = components.event
    const DateComponent = components.date
    const date = localizer.format(day, listDateFormat, culture)
    const dateLabel = DateComponent ? (
      <DateComponent day={day} label={date} />
    ) : (
      date
    )

    events = events.filter(e => inRange(e, day, day, this.props))

    const dateEvents = events.map((event, idx) => {
      const title = get(event, titleAccessor)
      const { className, style } = eventPropGetter
        ? eventPropGetter(
            event,
            get(event, startAccessor),
            get(event, endAccessor),
            isSelected(event, selected)
          )
        : {}

      return EventComponent ? (
        <EventComponent key={dayKey + '_' + idx} event={event} title={title} />
      ) : (
        <div
          key={dayKey + '_' + idx}
          className={'rbc-event ' + (className ? className : '')}
          style={style}
        >
          <div className="rbc-event-label">
            {this.timeRangeLabel(day, event)}
          </div>
          <div className="rbc-event-content">{title}</div>
        </div>
      )
    }, [])

    return dateEvents.length > 0 ? (
      <div key={dayKey} className="rbc-list-day">
        <div className="rbc-list-date">{dateLabel}</div>
        <div className="rbc-list-events">{dateEvents}</div>
      </div>
    ) : (
      false
    )
  }

  timeRangeLabel = (day, event) => {
    let {
      endAccessor,
      startAccessor,
      allDayAccessor,
      culture,
      messages,
      components,
    } = this.props

    let labelClass = '',
      TimeComponent = components.time,
      label = message(messages).allDay

    let start = get(event, startAccessor)
    let end = get(event, endAccessor)

    if (!get(event, allDayAccessor)) {
      if (dates.eq(start, end, 'day')) {
        label = localizer.format(
          { start, end },
          this.props.listTimeRangeFormat,
          culture
        )
      } else if (dates.eq(day, start, 'day')) {
        label = localizer.format(start, this.props.listTimeFormat, culture)
      } else if (dates.eq(day, end, 'day')) {
        label = localizer.format(end, this.props.listTimeFormat, culture)
      }
    }

    if (dates.gt(day, start, 'day')) labelClass = 'rbc-continues-prior'
    if (dates.lt(day, end, 'day')) labelClass += ' rbc-continues-after'

    return (
      <span className={labelClass.trim()}>
        {TimeComponent ? (
          <TimeComponent event={event} day={day} label={label} />
        ) : (
          label
        )}
      </span>
    )
  }
}

List.range = (start, { length = List.defaultProps.length }) => {
  let end = dates.add(start, length, 'day')
  return { start, end }
}

List.navigate = (date, action, { length = List.defaultProps.length }) => {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -length, 'day')

    case navigate.NEXT:
      return dates.add(date, length, 'day')

    default:
      return date
  }
}

List.title = (
  start,
  { length = List.defaultProps.length, formats, culture }
) => {
  let end = dates.add(start, length, 'day')
  return localizer.format({ start, end }, formats.listHeaderFormat, culture)
}

export default List
