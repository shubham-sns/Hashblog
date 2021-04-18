import ReactMarkdown from 'react-markdown'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'

function MarkdownRenderer({children}) {
  return <ReactMarkdown source={children} renderers={ChakraUIRenderer()} escapeHtml={false} />
}

export {MarkdownRenderer}
