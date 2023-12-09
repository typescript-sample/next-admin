"use client"

import { useEffect, useState } from 'react';
import { buildShownItems, Groups, Item } from '@lib/react-groups';
import { Privilege, StringMap, usePrivileges, useResource } from '@lib/uione';
import { useSearchParams } from 'next/navigation';

export default function   HomePage() {
  const [resource, setResource] = useState<StringMap>()
  const [items, setItems] = useState<Item[]>([]);
  const [shownItems, setShownItems] = useState<Item[]>([])
  const searchParams = useSearchParams()
  useEffect(() => {
    setResource(useResource())
    let groups = usePrivileges()
    setItems(groups)
  }, [])

  useEffect(() => {
    
    const v = searchParams?.get('query') as string || '';
    setShownItems(buildShownItems(v, items))
  }, [items])

  return <Groups title={resource?.welcome_title}
    groups={shownItems}
    resource={resource}
    className='view-container menu'
    groupClass='row group hr-height-1'
    headerClass='col s12 m12'
    subClass='col s6 m6 l3 xl2 group-span' />;
}
