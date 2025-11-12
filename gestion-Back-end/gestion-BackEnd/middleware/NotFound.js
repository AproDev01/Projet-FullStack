export function NotFound(req, res, next) {
  res.status(404).json({ message: "URL introvable" });
}
