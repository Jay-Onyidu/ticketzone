import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [msDuration, setMsDuration] = useState(60);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <div className="row ">
        <div className="col-sm-4 mb-2"></div>
        <div className="col-sm-4 mb-2">
          Time left to pay: {timeLeft} seconds
          <hr></hr>
          <CountdownCircleTimer
            isPlaying
            duration={msDuration}
            colors={[
              ['#004777', 0.33],
              ['#F7B801', 0.33],
              ['#A30000', 0.33],
            ]}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
          {errors}
          <hr></hr>
          <StripeCheckout
            token={({ id }) => doRequest({ token: id })}
            stripeKey="pk_test_51IXU2YHNY09wOSAB3wElsXLEThEOd5xoCuuiJ0cwPdvwsiOfPKFNMu3h70ByrvNtLZxcKOffYwqQHxl4jm6BO46q00cHYyL7qi"
            amount={order.ticket.price * 100}
            email={currentUser.email}
          >
            <button className="btn btn-primary">Checkout and Payment</button>
          </StripeCheckout>
        </div>
        <div className="col-sm-4 mb-2"></div>
      </div>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
