'use client'

const LIKED_CLUBS_KEY = 'likedClubs'

export const storage = {
    getLikedClubs: (): string[] => {
        if (typeof window === 'undefined') return []
        try {
            const likedClubs = localStorage.getItem(LIKED_CLUBS_KEY)
            return likedClubs ? JSON.parse(likedClubs) : []
        } catch (error) {
            console.error('Error reading liked clubs from localStorage:', error)
            return []
        }
    },

    toggleLikedClub: (clubId: string): boolean => {
        if (typeof window === 'undefined') return false
        try {
            const likedClubs = storage.getLikedClubs()
            const isLiked = likedClubs.includes(clubId)

            if (isLiked) {
                const newLikedClubs = likedClubs.filter(id => id !== clubId)
                localStorage.setItem(LIKED_CLUBS_KEY, JSON.stringify(newLikedClubs))
                return false
            } else {
                const newLikedClubs = [...likedClubs, clubId]
                localStorage.setItem(LIKED_CLUBS_KEY, JSON.stringify(newLikedClubs))
                return true
            }
        } catch (error) {
            console.error('Error toggling liked club in localStorage:', error)
            return false
        }
    },

    isClubLiked: (clubId: string): boolean => {
        if (typeof window === 'undefined') return false
        try {
            const likedClubs = storage.getLikedClubs()
            return likedClubs.includes(clubId)
        } catch (error) {
            console.error('Error checking if club is liked:', error)
            return false
        }
    }
} 