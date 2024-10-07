import React, { useState, useEffect } from 'react'
import { Clock, Send, Copy, Check } from 'lucide-react'

function App() {
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')
  const [datetime, setDatetime] = useState('')
  const [command, setCommand] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setRecipient(params.get('recipient') || '')
    setMessage(params.get('message') || '')
    setDatetime(params.get('datetime') || '')
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formattedDatetime = formatDatetime(datetime)
    const remindCommand = `/remind ${recipient} "${message}" ${formattedDatetime}`
    setCommand(remindCommand)
  }

  const formatDatetime = (datetimeString: string) => {
    const date = new Date(datetimeString)
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const generateShareableLink = () => {
    const params = new URLSearchParams({
      recipient,
      message,
      datetime
    })
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Slack Remind Command Constructor</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Recipient</label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="@username, #channel, or me"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <input
              type="text"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Your reminder message"
              required
            />
          </div>
          <div>
            <label htmlFor="datetime" className="block text-sm font-medium text-gray-700">Date and Time</label>
            <input
              type="datetime-local"
              id="datetime"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Send className="w-5 h-5 mr-2" />
            Generate Command
          </button>
        </form>
        {command && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Generated Command:</h2>
            <div className="bg-gray-100 p-3 rounded-md flex items-center justify-between">
              <div className="flex items-center flex-grow mr-2 overflow-hidden">
                <Clock className="w-5 h-5 mr-2 text-indigo-600 flex-shrink-0" />
                <code className="text-sm break-all overflow-hidden">{command}</code>
              </div>
              <button
                onClick={handleCopy}
                className="ml-2 p-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Shareable Link:</h2>
          <div className="bg-gray-100 p-3 rounded-md flex items-center justify-between">
            <input
              type="text"
              value={generateShareableLink()}
              readOnly
              className="bg-transparent flex-grow mr-2 text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateShareableLink())
                alert('Shareable link copied to clipboard!')
              }}
              className="ml-2 p-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
              title="Copy shareable link"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App