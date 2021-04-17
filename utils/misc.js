const formatDate = date =>
  new Intl.DateTimeFormat('en-US', {day: 'numeric', month: 'long', year: 'numeric'}).format(date)

export {formatDate}
