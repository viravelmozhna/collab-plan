import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  id: string;
  classNames: string;
  onClick?: (id: string) => void;
}>;

export default function ItemCard({ id, classNames, onClick, children }: Props) {
  return (
    <li key={id} className={classNames} onClick={() => onClick && onClick(id)}>
      {children}
    </li>
  );
}
