import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <div className="row ">
        <div className="col-sm-6 mb-2">
          <h5 className="card-title"> Title: {ticket.title}</h5>
          <h6>Price: ${ticket.price}</h6>

          <p className="card-text">{ticket.description}</p>
          {errors}
        </div>
        <div className="col-sm-6 mb-2">
          <img
            src={ticket.imageUrl}
            className="card-img-top"
            alt="..."
            width="100%"
            height="400"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          />
        </div>

        <button
          onClick={() => doRequest()}
          className="w-100 btn btn-primary btn-lg mb-2"
        >
          Purchase
        </button>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
