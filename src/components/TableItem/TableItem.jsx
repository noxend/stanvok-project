import React from 'react';
import './TableItem.css';

export default function TableItem({
  id,
  name,
  tagline,
  first_brewed,
  selectItem,
  itemId
}) {
  return (
    <tr
      onClick={() => {
        selectItem(id);
      }}
      className={`${id === itemId ? 'table-primary' : ''}`}
    >
      <th scope="row">{id}</th>
      <td>{name}</td>
      <td>{tagline}</td>
      <td>{first_brewed}</td>
    </tr>
  );
}
