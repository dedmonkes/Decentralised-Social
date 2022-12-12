export const truncateKey = (s: string, chars = 5) => {
    return s.slice(0, chars) + "…" + s.slice(-1 * chars);
};
