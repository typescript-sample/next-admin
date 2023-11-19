import { useEffect, useState } from 'react';
import { buildShownItems, Groups, Item } from '@lib/react-groups';
import { Privilege, StringMap, usePrivileges, useResource } from '@lib/uione';
import { useRouter } from 'next/router';
import HomePage from '@core/home';

export default function Home() {
  return <HomePage/>
}
