 style - {}  custom style of the list
• optionStyle - {}  custom style of the option element
• options - []  required array of options
• selectedOptions - []  optional array of initially selected options
• maxSelectedOptions - int  optional maximum number of selectable options
• onSelection - function(option){}  option selection callback
• renderIndicator - function(option)  should return a selected/deselected indicator node, default: check mark image
• renderSeparator - function(option)  should return a separator node that is displayed between the options, default: gray line
• renderText - function(option)  should return a text node, default: text node
• renderRow - function(option)  should return a option view
• disabled - bool  if set to true component is disabled and can't be interacted with
