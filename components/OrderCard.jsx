import React from 'react';

export default function OrderCard({ order }) {
  return (
    <div className="order-card">
      <div className="order-header">
        <div>
          <p className="order-label">ORDER ID <span className="order-id">{order.id}</span></p>
          <p className="order-date">{order.date}</p>
        </div>
        <span className={`badge-status ${order.statusClass}`}>{order.status}</span>
      </div>

      <div className="order-items">
        <div className="item-images">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className={`item-img ${item.more ? 'more-count' : ''}`}
              style={{
                backgroundColor: item.bg,
                zIndex: item.zIndex,
                marginLeft: item.overlap ? '-12px' : '0px',
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div className="item-text">
          <h4>{order.itemsTitle}</h4>
          <p>{order.itemsCount}</p>
        </div>
      </div>

      <div className="order-footer">
        <div>
          <p className="total-label">TOTAL AMOUNT</p>
          <p className="total-price">{order.total}</p>
        </div>
        <button className={order.buttonClass}>{order.buttonLabel}</button>
      </div>
    </div>
  );
}
