'use client';
import {useState} from 'react';
import {campaigns} from '@/lib/campaigns';
import {CampaignCard} from './CampaignCard';
export function CampaignGallery(){const [filter,setFilter]=useState('All ideas');const shown=campaigns.filter(x=>filter==='All ideas'||x.category===filter);return <><div className="filter-bar" role="group" aria-label="Filter creative directions">{['All ideas','Brand story','Product campaign'].map(x=><button className="filter-button" key={x} aria-pressed={filter===x} onClick={()=>setFilter(x)}>{x}</button>)}</div><h2 className="sr-only">Creative directions</h2><p className="sr-only" aria-live="polite">{shown.length} creative directions shown</p><div className="campaign-grid">{shown.map(c=><CampaignCard campaign={c} key={c.slug}/>)}</div></>}
