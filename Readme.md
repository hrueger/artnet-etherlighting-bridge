# ArtNet to Etherlighting Bridge
> Ubiquiti Etherlighting for realtime bias lighting 🎉

## Setup
OSB Capture -> Resolume with Gaussian Blur and ArtNet output -> this bridge -> Ubiquiti Etherlighting Switch

Create a `.env` file with the following variables:
```
SWITCH_IP=1.2.3.4
USERNAME="ssh username"
PASSWORD="ssh password"
```

Install dependencies with `yarn` and run the bridge with `yarn start`.

## Demo
[![Etherlighting bias lighting demo video](https://img.youtube.com/vi/8qCaXlVwdTs/0.jpg)](https://www.youtube.com/watch?v=8qCaXlVwdTs)

## License
MIT