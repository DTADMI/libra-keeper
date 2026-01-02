import { prisma } from "@/lib/db"

export async function isFeatureEnabled(name: string): Promise<boolean> {
  try {
    const flag = await prisma.featureFlag.findUnique({
      where: { name },
    });
    return !!flag?.isEnabled
  } catch (error) {
    console.error(`Error checking feature flag ${name}:`, error)
    return false
  }
}

export async function getSetting(key: string, defaultValue?: string): Promise<string | undefined> {
  try {
    const setting = await prisma.appSettings.findUnique({
      where: { key },
    });
    return setting?.value ?? defaultValue
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error)
    return defaultValue
  }
}
