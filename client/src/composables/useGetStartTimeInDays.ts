/**
 * Calculates the time difference between a given start date and today,
 * and returns a human-readable string like "2 days ago", "1 week ago", etc.
 * 
 * @param startDate - The start date as a string (ISO format or any valid date string)
 * @returns A formatted string representing the time difference
 */
export const getStartTimeInDays = (startDate: string): string => {
    const start = new Date(startDate);
    const today = new Date();
    
    // Validate that the date is valid
    if (isNaN(start.getTime())) {
        return 'Invalid date';
    }
    
    // Reset time to midnight for accurate day calculation
    const startDateNormalized = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Calculate difference in milliseconds
    const diffTime = todayNormalized.getTime() - startDateNormalized.getTime();
    
    // Convert to days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Handle future dates
    if (diffDays < 0) {
        const absDays = Math.abs(diffDays);
        if (absDays === 1) {
            return 'Tomorrow';
        } else if (absDays < 7) {
            return `In ${absDays} days`;
        } else if (absDays < 30) {
            const weeks = Math.floor(absDays / 7);
            return weeks === 1 ? 'In 1 week' : `In ${weeks} weeks`;
        } else if (absDays < 365) {
            const months = Math.floor(absDays / 30);
            return months === 1 ? 'In 1 month' : `In ${months} months`;
        } else {
            const years = Math.floor(absDays / 365);
            return years === 1 ? 'In 1 year' : `In ${years} years`;
        }
    }
    
    // Handle past dates
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return '1 day ago';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
        const years = Math.floor(diffDays / 365);
        return years === 1 ? '1 year ago' : `${years} years ago`;
    }
};