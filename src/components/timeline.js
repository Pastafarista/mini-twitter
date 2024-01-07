import { useState, useEffect } from 'react'
import Render from '@/components/render_tweet'

export default function Timeline() {

  const [tweets, setTweets] = useState([])

  useEffect(() => {
    fetch('https://kfeafzzvpf.execute-api.us-east-1.amazonaws.com/default/get_tweets')
      .then((res) => res.json())
      .then((object) => setTweets([...object.tweets].reverse()))
  }, [])

  return (
    <ul>
      {tweets.map((tweet) => (
	<li key={tweet.id}>
	  <Render tweet={tweet} />
	</li>
      ))}
    </ul>
  )
}
 

