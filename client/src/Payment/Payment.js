import axios from "axios";
import { useState } from "react";
import API_LINK from "../../api.link"
function Payment() {
	const [book, setBook] = useState({
		name: "The Fault In Our Stars",
		author: "John Green",
		img: "https://images-na.ssl-images-amazon.com/images/I/817tHNcyAgL.jpg",
		price: 100,
	});

	const initPayment = (data) => {
		const options = {
			key: "rzp_test_AxxggAMmaYmfVX",
			amount: data.amount,
			currency: data.currency,
			name: "Doctor Appointment",
			description: "Test Transaction",
			image: book.img,
			order_id: data.id,
			handler: async (response) => {
				try {
					const verifyUrl = `${API_LINK}/payments/verify`;
					const { data } = await axios.post(verifyUrl, response);
					console.log(data);
				} catch (error) {
					console.log(error);
				}
			},
			theme: {
				color: "#3399cc",
			},
		};
		const rzp1 = new window.Razorpay(options);
		rzp1.open();
	};

	const handlePayment = async () => {
		try {
			const orderUrl = `${API_LINK}/payments/orders`;
			const { data } = await axios.post(orderUrl, { amount: book.price });
			console.log(data);
			initPayment(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="App">
			<div className="book_container">
				<img src={book.img} alt="book_img" className="book_img" />
				<p className="book_name">{book.name}</p>
				<p className="book_author">By {book.author}</p>
				<p className="book_price">
					Price : <span>&#x20B9; {book.price}</span>
				</p>
				<button onClick={handlePayment} className="buy_btn">
					buy now
				</button>
			</div>
		</div>
	);
}

export default Payment;