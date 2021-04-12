import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <div className="col" key={ticket.id}>
        <div className="card shadow-sm p-3 border bg-light">
          <img
            src={ticket.imageUrl}
            className="card-img-top"
            alt="..."
            width="100%"
            height="225"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          />

          <div className="card-body">
            <h5 className="card-title">{ticket.title}</h5>
            <p className="card-text">
              {ticket.description.length > 34
                ? `${ticket.description.substring(0, 34)} ...`
                : ticket.description}
            </p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                  <a className="btn btn-sm btn-outline-secondary">
                    View Ticket
                  </a>
                </Link>
              </div>
              <small className="text-muted">
                <span> $ </span>
                {ticket.price}
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <h4>Tickets</h4>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {ticketList}
      </div>
    </>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
