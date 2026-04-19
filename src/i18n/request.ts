import { getRequestConfig } from 'next-intl/server'
import { routing, type Locale } from './routing'

// 静态导入所有翻译文件
import enMessages from '@/locales/en.json'
import deMessages from '@/locales/de.json'
import ruMessages from '@/locales/ru.json'
import ptMessages from '@/locales/pt.json'

const messages: Record<string, any> = {
	en: enMessages,
	de: deMessages,
	ru: ruMessages,
	pt: ptMessages,
}

function isPlainObject(value: unknown): value is Record<string, any> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Merge localized messages onto English defaults.
 * Arrays are replaced (not merged) to avoid duplicated list entries.
 */
function mergeWithFallback(base: any, localized: any): any {
	if (Array.isArray(base) && Array.isArray(localized)) {
		return localized
	}

	if (isPlainObject(base) && isPlainObject(localized)) {
		const result: Record<string, any> = { ...base }

		for (const [key, value] of Object.entries(localized)) {
			result[key] = key in base ? mergeWithFallback(base[key], value) : value
		}

		return result
	}

	return localized === undefined ? base : localized
}

export default getRequestConfig(async ({ requestLocale }) => {
	let locale = await requestLocale

	// 使用 routing.locales 动态验证（无需硬编码类型）
	if (!locale || !routing.locales.includes(locale as Locale)) {
		locale = routing.defaultLocale
	}

	if (locale === 'en') {
		return { locale, messages: enMessages }
	}

	// 加载目标语言的翻译，并与英文深度合并（作为 fallback）
	const localeMessages = messages[locale] || enMessages
	const mergedMessages = mergeWithFallback(enMessages, localeMessages)

	return { locale, messages: mergedMessages }
})
