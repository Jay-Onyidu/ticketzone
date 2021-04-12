const OrderIndex = ({ orders }) => {
  const OrderList = orders
    .map((order) => {
      return (
        <tr key={order.id}>
          <td>{order.ticket.title}</td>
          <td>{order.ticket.price}</td>
          <td>{order.status}</td>
        </tr>
      );
    })
    .reverse();
  return (
    <div>
      <h4>Orders</h4>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{OrderList}</tbody>
      </table>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderIndex;
