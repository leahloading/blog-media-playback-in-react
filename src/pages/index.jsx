import { useState, useRef } from 'react'
import { parse } from 'rss-to-json'

export default function AudioPlayer({ episodes }) {
  let [isPlaying, setIsPlaying] = useState(false)
  const myRef = useRef(null)

  const episodeAudio = episodes[0].audio.src
  const episodeImage = episodes[0].image
  const episodeTitle = episodes[0].title

  const handlePlay = () => {
    myRef.current.play()
    setIsPlaying((prevValue) => !prevValue)
  }
  const handlePause = () => {
    myRef.current.pause()
    setIsPlaying((prevValue) => !prevValue)
  }

  function PauseButton() {
    return (
      <button className="pb-6" onClick={isPlaying ? handlePause : handlePlay}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z"
          />
        </svg>
      </button>
    )
  }

  function PlayButton() {
    return (
      <button className="pb-6" onClick={isPlaying ? handlePause : handlePlay}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
          />
        </svg>
      </button>
    )
  }

  return (
    <>
      <audio ref={myRef} src={episodeAudio}></audio>
      <div className="mt-8">
        <div className="mx-auto w-1/2 max-w-md overflow-hidden rounded shadow-lg">
          <div className="relative bg-red-200 pb-[75%]">
            <img
              className="absolute h-full w-full object-cover"
              src={episodeImage}
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 text-center font-medium text-black">
              {episodeTitle}
            </div>
            {isPlaying ? PauseButton() : PlayButton()}
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  let feed = await parse('https://feeds.buzzsprout.com/403111.rss')

  return {
    props: {
      episodes: feed.items.map(({ title, enclosures, itunes_image }) => ({
        title,
        audio: enclosures.map((enclosure) => ({
          src: enclosure.url,
          type: enclosure.type,
        }))[0],
        image: itunes_image.href,
      })),
    },
    revalidate: 10,
  }
}
