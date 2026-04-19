import type { Metadata } from 'next'
import { getLatestArticles } from '@/lib/getLatestArticles'
import { buildModuleLinkMap } from '@/lib/buildModuleLinkMap'
import type { Language } from '@/lib/content'
import HomePageClient, { type HomePageConfig } from './HomePageClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

const FALLBACK_SITE_URL = 'https://windrosewiki.wiki'

const HOME_PAGE_CONFIG: HomePageConfig = {
  videoId: 'TM0agoKI2Ts',
  videoTitle: 'Windrose - Official Early Access Launch Trailer',
  links: {
    officialSite: 'https://playwindrose.com/',
    steamStore: 'https://store.steampowered.com/app/3041230/Windrose/',
    steamCommunity: 'https://steamcommunity.com/app/3041230',
    steamNews: 'https://store.steampowered.com/news/app/3041230',
    discord: 'https://discord.com/invite/windrose',
    reddit: 'https://www.reddit.com/r/crosswind/',
    youtube: 'https://www.youtube.com/@PlayWindrose',
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL
  const heroImage = new URL('/images/hero.webp', siteUrl).toString()
  const canonicalUrl = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`

  return {
    title: 'Windrose - guide, ships, bosses & map',
    description:
      'Windrose hub for guides, ships, bosses, maps, crafting, and updates. Track Steam release details, survival tips, and sea combat essentials in one place.',
    keywords: [
      'Windrose',
      'Steam',
      'guide',
      'ships',
      'bosses',
      'map',
      'crafting',
      'updates',
      'pirate survival',
    ],
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      siteName: 'Windrose Wiki',
      title: 'Windrose - guide, ships, bosses & map',
      description:
        'Windrose hub for guides, ships, bosses, maps, crafting, and updates. Track Steam release details, survival tips, and sea combat essentials in one place.',
      images: [
        {
          url: heroImage,
          width: 1920,
          height: 1080,
          alt: 'Windrose pirate survival hero artwork',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Windrose - guide, ships, bosses & map',
      description:
        'Windrose hub for guides, ships, bosses, maps, crafting, and updates. Track Steam release details, survival tips, and sea combat essentials in one place.',
      images: [heroImage],
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL
  const latestArticles = await getLatestArticles(locale as Language, 30)
  const moduleLinkMap = await buildModuleLinkMap(locale as Language)
  const heroImage = new URL('/images/hero.webp', siteUrl).toString()

  const homepageStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Windrose Wiki',
        description:
          'Windrose wiki hub for guides, ships, bosses, maps, crafting, and Early Access updates.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Windrose Wiki',
        url: siteUrl,
        logo: `${siteUrl}/android-chrome-512x512.png`,
        image: heroImage,
        sameAs: [
          HOME_PAGE_CONFIG.links.officialSite,
          HOME_PAGE_CONFIG.links.steamStore,
          HOME_PAGE_CONFIG.links.discord,
          HOME_PAGE_CONFIG.links.reddit,
          HOME_PAGE_CONFIG.links.youtube,
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }}
      />
      <HomePageClient
        latestArticles={latestArticles}
        moduleLinkMap={moduleLinkMap}
        locale={locale}
        homePageConfig={HOME_PAGE_CONFIG}
      />
    </>
  )
}
