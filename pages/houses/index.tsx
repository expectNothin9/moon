import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { setMapInitialized } from '../../features/houses/housesSlices'
import { RootState } from '../../store'
import { loadCss, loadJs } from '../../util/load'

const OL_CSS =
  'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.5.0/css/ol.css'
const OL_JS =
  'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.5.0/build/ol.js'

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
  height: 60vh;
  background: #fff;
  position: relative;
`
const Map = () => {
  const map = useRef()
  const dispatch = useDispatch()
  const mapInitialized = useSelector((state: RootState) => {
    return state.houses.map.initialized
  })

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
          map.current = new ol.Map({
            target: 'map',
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM()
              })
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([37.41, 8.82]),
              zoom: 4
            })
          })
          dispatch(setMapInitialized(true))
        } else {
          console.log('failed to initialize HousesPage')
        }
      }
      loadResources()
    }
  }, [dispatch, mapInitialized])
  return <StyledMap id="map">{!mapInitialized && <Loading />}</StyledMap>
}
const StyledHousesPage = styled.main`
  width: 100%;
  height: 100%;
  background: var(--ultimate-gray);
`

const HousesPage = () => (
  <StyledHousesPage>
    <Map />
  </StyledHousesPage>
)

export default HousesPage
