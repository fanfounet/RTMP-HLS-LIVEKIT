# RTMP-HLS-LIVEKIT
## Démarrage
`docker compose up --pull always`

## installation du livekit CLI
(voir doc)

## Création d'une salle
`
lk room create test-room \
  --url http://localhost:7880 \
  --api-key devkey \
  --api-secret secret
`

## Création du ingress RTMP
`
lk ingress create ingress-request.json \
  --url http://localhost:7880 \
  --api-key devkey \
  --api-secret secret
`

## Création et démarrage du egress
`
lk egress start --type participant request.json \
  --url http://localhost:7880 \
  --api-key devkey \
  --api-secret secret
`