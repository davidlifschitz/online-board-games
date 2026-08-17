# Ticket-to-Ride-style route game

Build an original open-source route-building board game inspired by railway-network games.

Do not use Ticket to Ride branding, its map, city layout, route layout, destination cards, train artwork, or copied rules. Create an original map and theme.

Working title: “Railbound.”

## Map
- Create a fictional continent or an original U.S.-inspired-but-not-identical map.
- 30–40 cities.
- 50–70 connections.
- Routes have length, color requirement, and optional neutral/gray color.
- Some city pairs can have parallel routes for larger player counts.

## Cards
- Colored transport cards.
- Wild locomotion-equivalent cards with original branding.
- Face-up market plus draw pile.

## Turn options
- Draw transport cards.
- Claim a route by spending matching cards.
- Draw destination objectives.
- Optional station-like rescue mechanic if made sufficiently original.

## Scoring
- Route points scale by length.
- Destination cards score if connected, subtract if incomplete.
- Longest continuous network bonus.
- First player to reach a low train-piece threshold triggers final round.

## Modes
- 2–5 players.
- Bots.
- Online multiplayer.
- Local play.

## Bots
- Easy pursues short obvious routes.
- Medium plans shortest paths for objectives.
- Hard accounts for opponent blocking, shared choke points, card-market value, multiple objective synergy, and endgame timing.

## UI
- SVG map.
- Click a route to claim.
- Route ownership clearly visible.
- Destination cards private.
- Card market visible.
- Train-piece count.
- Score track.
- Mobile pan/zoom.

## Technical
- Graph algorithms for connectivity, shortest paths, and longest owned continuous route.
- Private player objectives should not leak to other clients.
- Tests for route claiming, card payment, connectivity, destination scoring, longest-network calculations, and endgame trigger.
- Original map/assets.
- Open-source license.
- Deploy to Vercel.
