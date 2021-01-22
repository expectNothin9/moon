import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'
import { useEffect, useRef } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { setMapInitialized, setSelectedId } from '../../features/houses/housesSlices'
import { RootState } from '../../store'
import { loadCss, loadJs } from '../../util/load'

const OL_CSS =
  'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.5.0/css/ol.css'
const OL_JS =
  'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.5.0/build/ol.js'

const DEFAULT = {
  center: [121.5173735, 25.0477022],
  zoom: 14
}

const StyledLinearProgress = withStyles(() => ({
  colorPrimary: {
    backgroundColor: '#fff'
  },
  bar: {
    backgroundColor: 'var(--illuminating)'
  }
}))(LinearProgress)

const StyledLoading = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
`
const Loading = () => (
  <StyledLoading>
    <StyledLinearProgress />
  </StyledLoading>
)

const StyledMap = styled.section`
  width: 100%;
  height: 100vh;
  background: #fff;
  position: relative;
`
const Map = () => {
  const map = useRef()
  const dispatch = useDispatch()
  const { mapInitialized, landmarks } = useSelector((state: RootState) => {
    const { map, landmarks } = state.houses
    return {
      mapInitialized: map.initialized,
      landmarks
    }
  }, shallowEqual)

  useEffect(() => {
    if (!mapInitialized) {
      const loadResources = async () => {
        const isLoaded = await Promise.all([loadCss(OL_CSS), loadJs(OL_JS)]).then(
          (loadStatuses) => {
            return loadStatuses[0] && loadStatuses[1]
          }
        )
        if (isLoaded) {
          // eslint-disable-next-line
          // @ts-ignore
          const ol = window.ol
          const { Icon, Style } = ol.style
          const pinIconStyle = new Style({
            image: new Icon({
              anchor: [0.5, 0.75],
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              src: 'icons/star-pin.png'
            })
          })
          const landmarkFeatures = landmarks.map((landmark) => {
            const { lonLat, id } = landmark
            const feature = new ol.Feature({
              geometry: new ol.geom.Point(ol.proj.fromLonLat(lonLat)),
              id
            })
            feature.setStyle(pinIconStyle)
            return feature
          })

          const vectorSource = new ol.source.Vector({
            features: landmarkFeatures
          })
          const vectorLayer = new ol.layer.Vector({
            source: vectorSource
          })
          map.current = new ol.Map({
            target: 'map',
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM()
              }),
              vectorLayer
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat(DEFAULT.center),
              zoom: DEFAULT.zoom
            })
          })

          // eslint-disable-next-line
          // @ts-ignore
          map.current.on('click', (event) => {
            // eslint-disable-next-line
            // @ts-ignore
            const landmark = map.current.forEachFeatureAtPixel(event.pixel, (feature) => {
              return feature
            })
            if (landmark) {
              dispatch(setSelectedId(landmark.get('id')))
            }
          })

          dispatch(setMapInitialized(true))
        } else {
          console.log('failed to initialize HousesPage')
        }
      }
      loadResources()
    }
  }, [dispatch, mapInitialized, landmarks])
  return <StyledMap id="map">{!mapInitialized && <Loading />}</StyledMap>
}

const StyledInformation = styled.section`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  color: var(--illuminating);
`
const Information = () => {
  const dispatch = useDispatch()
  const { selectedLandmark } = useSelector((state: RootState) => {
    const { landmarks, selectedId } = state.houses
    return {
      selectedLandmark: landmarks.find((landmark) => landmark.id === selectedId)
    }
  }, shallowEqual)
  return selectedLandmark ? (
    <StyledInformation onClick={() => dispatch(setSelectedId(''))}>
      {selectedLandmark.name}
    </StyledInformation>
  ) : null
}

const StyledHousesPage = styled.main`
  width: 100%;
  height: 100%;
`

const HousesPage = () => (
  <StyledHousesPage>
    <Map />
    <Information />
  </StyledHousesPage>
)

export default HousesPage
