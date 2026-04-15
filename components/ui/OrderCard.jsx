import React from 'react';

const OrderCard = ({ order }) => {
  return (
    <div className="order-card" style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '16px', marginBottom: '16px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      {/* Header */}
      <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div className="order-info" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="order-id" style={{ fontWeight: '600', color: '#1f2937' }}>{order.id}</span>
          <span className="order-date" style={{ fontSize: '12px', color: '#6b7280' }}>{order.date}</span>
        </div>
        <span className={`status-badge ${order.statusClass}`} style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
          {order.status}
        </span>
      </div>

      {/* Items Preview */}
      <div className="order-items-preview" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
        <div className="items-icons" style={{ display: 'flex' }}>
          {order.items.map((item, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: item.bg,
                zIndex: item.zIndex,
                marginLeft: item.overlap ? '-12px' : '0',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff',
                fontSize: item.more ? '14px' : '20px',
                fontWeight: item.more ? '600' : 'normal',
                color: item.more ? '#1e3a8a' : 'inherit'
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div className="items-desc" style={{ flex: 1 }}>
          <div className="items-title" style={{ fontWeight: '500', color: '#374151', fontSize: '14px' }}>{order.itemsTitle}</div>
          <div className="items-count" style={{ fontSize: '12px', color: '#9ca3af' }}>{order.itemsCount}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="order-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="order-total" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="total-label" style={{ fontSize: '12px', color: '#6b7280' }}>Total</span>
          <span className="total-amount" style={{ fontWeight: '700', color: '#1f2937' }}>{order.total}</span>
        </div>
        <button 
          className={`btn ${order.buttonClass}`}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            backgroundColor: order.buttonClass === 'btn-primary' ? '#0d47a1' : order.buttonClass === 'btn-secondary' ? '#e2e8f0' : 'transparent',
            color: order.buttonClass === 'btn-primary' ? '#fff' : order.buttonClass === 'btn-secondary' ? '#1f2937' : '#0d47a1'
          }}
        >
          {order.buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
