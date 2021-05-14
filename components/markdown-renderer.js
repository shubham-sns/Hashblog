/* eslint-disable react/display-name */
import ReactMarkdown from 'react-markdown'
import ChakraUIRenderer, {defaults} from 'chakra-ui-markdown-renderer'
import {Code} from '@chakra-ui/layout'

const newTheme = {
  ...defaults,
  code: props => {
    const {language, value} = props
    const className = language && `language-${language}`
    return (
      <pre>
        <Code p={2} overflowX="scroll" maxW="full" className={className || null}>
          {value}
        </Code>
      </pre>
    )
  },
}

function MarkdownRenderer({children}) {
  return <ReactMarkdown source={children} renderers={ChakraUIRenderer(newTheme)} escapeHtml={false} />
}

export {MarkdownRenderer}
