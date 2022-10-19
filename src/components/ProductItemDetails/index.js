import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class PrimeDealsSection extends Component {
  state = {
    productDetails: {},
    similarProductDetails: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetailsApiUrl()
  }

  getFormattedData = data => ({
    imageUrl: data.image_url,
    title: data.title,
    price: data.price,
    description: data.description,
    availability: data.availability,
    brand: data.brand,
    totalReviews: data.total_reviews,
    id: data.id,
    rating: data.rating,
  })

  getProductDetailsApiUrl = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProducts = fetchedData.similar_products.map(each =>
        this.getFormattedData(each),
      )
      this.setState({
        productDetails: updatedData,
        similarProductDetails: updatedSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  plusBtn = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  minusBtn = () => {
    this.setState(prevState => ({quantity: prevState.quantity - 1}))
  }

  renderProductDetailView = () => {
    const {productDetails, similarProductDetails} = this.state
    const {
      imageUrl,
      title,
      price,
      totalReviews,
      description,
      availability,
      brand,
      quantity,
    } = productDetails
    return (
      <>
        <Header />
        <div className="details-section-container">
          <img src={imageUrl} alt="product" className="detail-image" />
          <div className="text-container">
            <h1 className="error-heading">{title}</h1>
            <p>{price}</p>
            <div>
              <div className="rating-container">
                <p className="rating">{quantity}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p>{totalReviews}</p>
            </div>
            <p>{description}</p>
            <p>Available: {availability}</p>
            <p>Brand: {brand}</p>
            <hr className="line" />
            <div>
              <button type="button" onClick={this.plusBtn} testid="plus">
                <BsPlusSquare />
              </button>
              <p className="count">1</p>
              <button type="button" onClick={this.minusBtn} testid="minus">
                <BsDashSquare />
              </button>
            </div>
            <button className="add-to-cart" type="button">
              ADD TO CART
            </button>
          </div>

          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="un-order-list">
            {similarProductDetails.map(eachCard => (
              <SimilarProductItem key={eachCard.id} similarDetails={eachCard} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <>
      <Header />

      <div className="error-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="error view"
          className="error-view"
        />
        <h1 className="error-heading">Product Not Found</h1>
        <button type="button" className="continue-shopping-btn">
          Continue Shopping
        </button>
      </div>
    </>
  )

  renderLoadingView = () => (
    <div className="loading" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default PrimeDealsSection
