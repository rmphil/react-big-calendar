'use strict'

exports.__esModule = true

var _propTypes = require('prop-types')

var _propTypes2 = _interopRequireDefault(_propTypes)

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _localizer = require('./localizer')

var _localizer2 = _interopRequireDefault(_localizer)

var _messages = require('./utils/messages')

var _messages2 = _interopRequireDefault(_messages)

var _dates = require('./utils/dates')

var _dates2 = _interopRequireDefault(_dates)

var _helpers = require('./utils/helpers')

var _constants = require('./utils/constants')

var _accessors = require('./utils/accessors')

var _propTypes3 = require('./utils/propTypes')

var _eventLevels = require('./utils/eventLevels')

var _selection = require('./utils/selection')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    )
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}

var List = (function(_React$Component) {
  _inherits(List, _React$Component)

  function List() {
    var _temp, _this, _ret

    _classCallCheck(this, List)

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    return (
      (_ret = ((_temp = ((_this = _possibleConstructorReturn(
        this,
        _React$Component.call.apply(_React$Component, [this].concat(args))
      )),
      _this)),
      _initialiseProps.call(_this),
      _temp)),
      _possibleConstructorReturn(_this, _ret)
    )
  }

  List.prototype.render = function render() {
    var _this2 = this

    var _props = this.props,
      length = _props.length,
      date = _props.date,
      events = _props.events,
      startAccessor = _props.startAccessor

    var end = _dates2.default.add(date, length, 'day')
    var range = _dates2.default.range(date, end, 'day')

    events = events.filter(function(event) {
      return (0, _eventLevels.inRange)(event, date, end, _this2.props)
    })
    events.sort(function(a, b) {
      return (
        +(0, _accessors.accessor)(a, startAccessor) -
        +(0, _accessors.accessor)(b, startAccessor)
      )
    })

    return _react2.default.createElement(
      'div',
      { className: 'rbc-list-view' },
      _react2.default.createElement(
        'div',
        { className: 'rbc-list-content' },
        range.map(function(day, idx) {
          return _this2.renderDay(day, events, idx)
        })
      )
    )
  }

  return List
})(_react2.default.Component)

List.propTypes = {
  events: _propTypes2.default.array,
  date: _propTypes2.default.instanceOf(Date),
  length: _propTypes2.default.number.isRequired,
  titleAccessor: _propTypes3.accessor.isRequired,
  tooltipAccessor: _propTypes3.accessor.isRequired,
  allDayAccessor: _propTypes3.accessor.isRequired,
  startAccessor: _propTypes3.accessor.isRequired,
  endAccessor: _propTypes3.accessor.isRequired,
  eventPropGetter: _propTypes2.default.func,
  selected: _propTypes2.default.object,
  listDateFormat: _propTypes3.dateFormat,
  listTimeFormat: _propTypes3.dateFormat,
  listTimeRangeFormat: _propTypes3.dateRangeFormat,
  culture: _propTypes2.default.string,
  components: _propTypes2.default.object.isRequired,
  onSelectEvent: _propTypes2.default.func.isRequired,
  onDoubleClickEvent: _propTypes2.default.func.isRequired,
  messages: _propTypes2.default.shape({
    date: _propTypes2.default.string,
    time: _propTypes2.default.string,
  }),
}
List.defaultProps = {
  length: 30,
}

var _initialiseProps = function _initialiseProps() {
  var _this3 = this

  this.renderDay = function(day, events, dayKey) {
    var _props2 = _this3.props,
      culture = _props2.culture,
      components = _props2.components,
      titleAccessor = _props2.titleAccessor,
      listDateFormat = _props2.listDateFormat,
      eventPropGetter = _props2.eventPropGetter,
      startAccessor = _props2.startAccessor,
      endAccessor = _props2.endAccessor,
      selected = _props2.selected

    var EventComponent = components.event
    var DateComponent = components.date
    var date = _localizer2.default.format(day, listDateFormat, culture)
    var dateLabel = DateComponent
      ? _react2.default.createElement(DateComponent, { day: day, label: date })
      : date

    events = events.filter(function(e) {
      return (0, _eventLevels.inRange)(e, day, day, _this3.props)
    })

    var dateEvents = events.map(function(event, idx) {
      var title = (0, _accessors.accessor)(event, titleAccessor)

      var _ref4 = eventPropGetter
          ? eventPropGetter(
              event,
              (0, _accessors.accessor)(event, startAccessor),
              (0, _accessors.accessor)(event, endAccessor),
              (0, _selection.isSelected)(event, selected)
            )
          : {},
        className = _ref4.className,
        style = _ref4.style

      return EventComponent
        ? _react2.default.createElement(EventComponent, {
            key: dayKey + '_' + idx,
            event: event,
            title: title,
            onClick: function onClick(e) {
              return _this3._select(event, e)
            },
            onDoubleClick: function onDoubleClick(e) {
              return _this3._doubleClick(event, e)
            },
          })
        : _react2.default.createElement(
            'div',
            {
              key: dayKey + '_' + idx,
              className: 'rbc-event ' + (className ? className : ''),
              style: style,
              onClick: function onClick(e) {
                return _this3._select(event, e)
              },
              onDoubleClick: function onDoubleClick(e) {
                return _this3._doubleClick(event, e)
              },
            },
            _react2.default.createElement(
              'div',
              { className: 'rbc-event-label' },
              _this3.timeRangeLabel(day, event)
            ),
            _react2.default.createElement(
              'div',
              { className: 'rbc-event-content' },
              title
            )
          )
    }, [])

    return dateEvents.length > 0
      ? _react2.default.createElement(
          'div',
          { key: dayKey, className: 'rbc-list-day' },
          _react2.default.createElement(
            'div',
            { className: 'rbc-list-date' },
            dateLabel
          ),
          _react2.default.createElement(
            'div',
            { className: 'rbc-list-events' },
            dateEvents
          )
        )
      : false
  }

  this.timeRangeLabel = function(day, event) {
    var _props3 = _this3.props,
      endAccessor = _props3.endAccessor,
      startAccessor = _props3.startAccessor,
      allDayAccessor = _props3.allDayAccessor,
      culture = _props3.culture,
      messages = _props3.messages,
      components = _props3.components

    var labelClass = '',
      TimeComponent = components.time,
      label = (0, _messages2.default)(messages).allDay

    var start = (0, _accessors.accessor)(event, startAccessor)
    var end = (0, _accessors.accessor)(event, endAccessor)

    if (!(0, _accessors.accessor)(event, allDayAccessor)) {
      if (_dates2.default.eq(start, end, 'day')) {
        label = _localizer2.default.format(
          { start: start, end: end },
          _this3.props.listTimeRangeFormat,
          culture
        )
      } else if (_dates2.default.eq(day, start, 'day')) {
        label = _localizer2.default.format(
          start,
          _this3.props.listTimeFormat,
          culture
        )
      } else if (_dates2.default.eq(day, end, 'day')) {
        label = _localizer2.default.format(
          end,
          _this3.props.listTimeFormat,
          culture
        )
      }
    }

    if (_dates2.default.gt(day, start, 'day'))
      labelClass = 'rbc-continues-prior'
    if (_dates2.default.lt(day, end, 'day'))
      labelClass += ' rbc-continues-after'

    return _react2.default.createElement(
      'span',
      { className: labelClass.trim() },
      TimeComponent
        ? _react2.default.createElement(TimeComponent, {
            event: event,
            day: day,
            label: label,
          })
        : label
    )
  }

  this._select = function() {
    for (
      var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2] = arguments[_key2]
    }

    ;(0, _helpers.notify)(_this3.props.onSelectEvent, args)
  }

  this._doubleClick = function() {
    for (
      var _len3 = arguments.length, args = Array(_len3), _key3 = 0;
      _key3 < _len3;
      _key3++
    ) {
      args[_key3] = arguments[_key3]
    }

    ;(0, _helpers.notify)(_this3.props.onDoubleClickEvent, args)
  }
}

List.range = function(start, _ref) {
  var _ref$length = _ref.length,
    length = _ref$length === undefined ? List.defaultProps.length : _ref$length

  var end = _dates2.default.add(start, length, 'day')
  return { start: start, end: end }
}

List.navigate = function(date, action, _ref2) {
  var _ref2$length = _ref2.length,
    length =
      _ref2$length === undefined ? List.defaultProps.length : _ref2$length

  switch (action) {
    case _constants.navigate.PREVIOUS:
      return _dates2.default.add(date, -length, 'day')

    case _constants.navigate.NEXT:
      return _dates2.default.add(date, length, 'day')

    default:
      return date
  }
}

List.title = function(start, _ref3) {
  var _ref3$length = _ref3.length,
    length =
      _ref3$length === undefined ? List.defaultProps.length : _ref3$length,
    formats = _ref3.formats,
    culture = _ref3.culture

  var end = _dates2.default.add(start, length, 'day')
  return _localizer2.default.format(
    { start: start, end: end },
    formats.listHeaderFormat,
    culture
  )
}

exports.default = List
module.exports = exports['default']
