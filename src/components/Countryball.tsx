/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BALL_PATH, EyeSet, Accessory, Shape, SHAPES } from '../constants/assets';

interface CountryballProps {
  countryCode: string;
  flagUrlOverride?: string;
  eyes: EyeSet;
  accessory: Accessory;
  accessory2: Accessory;
  shape?: Shape;
  size?: number;
  innerRef?: React.RefObject<HTMLDivElement | null>;
  eyesOffset: { x: number; y: number; scale: number; rotation: number };
  hatOffset: { x: number; y: number; scale: number; rotation: number };
  hat2Offset: { x: number; y: number; scale: number; rotation: number };
  rotation?: number;
  rotationX?: number;
  rotationY?: number;
  flipX?: boolean;
  flipY?: boolean;
  ballColor?: string;
  useFlag?: boolean;
}

export function Countryball({ 
  countryCode, 
  flagUrlOverride,
  eyes, 
  accessory, 
  accessory2,
  shape = SHAPES[0],
  size = 300, 
  innerRef, 
  eyesOffset, 
  hatOffset,
  hat2Offset,
  rotation = 0,
  rotationX = 0,
  rotationY = 0,
  flipX = false,
  flipY = false,
  ballColor = '#ffffff',
  useFlag = true
}: CountryballProps) {
  // Polandball meme convention: Poland is upside down (Red on top)
  const isPoland = countryCode.toLowerCase() === 'pl';
  const isNepal = countryCode.toLowerCase() === 'np';
  const isSingapore = countryCode.toLowerCase() === 'sg'; // Tringapore
  const isIsrael = countryCode.toLowerCase() === 'il'; // Israelcube
  const flagUrl = flagUrlOverride || `https://flagcdn.com/w1280/${countryCode.toLowerCase()}.png`;

  const [internalFlagUrl, setInternalFlagUrl] = React.useState<string>(flagUrl);

  React.useEffect(() => {
    let active = true;
    
    if (!useFlag) return;
    if (flagUrl.startsWith('data:')) {
      setInternalFlagUrl(flagUrl);
      return;
    }

    const loadAsDataUrl = async () => {
      try {
        let fetchUrl = flagUrl;
        
        // Resolve wikimedia thumb PHP URLs via Wikimedia API to get direct CORS-enabled URLs
        if (flagUrl.includes('wikimedia.org/w/thumb.php')) {
          const match = flagUrl.match(/[?&]f=([^&]+)/);
          if (match) {
            const filename = match[1];
            try {
              const apiRes = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&titles=File:${filename}&prop=imageinfo&iiprop=url&iiurlwidth=1280&format=json&origin=*`);
              const data = await apiRes.json();
              const pages = data.query?.pages;
              if (pages) {
                const pageId = Object.keys(pages)[0];
                const imageInfo = pages[pageId]?.imageinfo?.[0];
                if (imageInfo && imageInfo.thumburl) {
                  fetchUrl = imageInfo.thumburl;
                }
              }
            } catch (e) {
              console.warn("Failed to resolve Wikimedia API URL, falling back to original", e);
            }
          }
        } else if (flagUrl.includes('wikimedia.org')) {
          // Fallback proxy for other wikimedia links just in case
          fetchUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(flagUrl)}`;
        }

        const response = await fetch(fetchUrl, {
          mode: 'cors',
          credentials: 'omit'
        });
        if (!response.ok) {
           throw new Error(`HTTP ${response.status}`);
        }
        
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (active && reader.result) {
            setInternalFlagUrl(reader.result as string);
          }
        };
        reader.readAsDataURL(blob);
      } catch (e) {
        console.error("Failed to load flag as data URL", e);
        if (active) setInternalFlagUrl(flagUrl);
      }
    };
    
    loadAsDataUrl();
    
    return () => { active = false; };
  }, [flagUrl, useFlag]);

  // Automatic shape overrides based on meme rules
  const NEPAL_PATH = "M15,5 L90,45 L45,45 L90,95 L15,95 Z";
  
  let currentPath = shape.path;
  
  // Apply meme overrides if specific shape isn't selected or if we want to be strictly canonical
  // Actually, let's let the user override, but default if "Ball" is selected? 
  // No, let's just make the overrides available as custom selections or auto-apply if specifically BALL is selected.
  if (shape.id === 'ball') {
    if (isNepal) currentPath = NEPAL_PATH;
    else if (isSingapore) currentPath = SHAPES.find(s => s.id === 'triangle')?.path || shape.path;
    else if (isIsrael) currentPath = SHAPES.find(s => s.id === 'square')?.path || shape.path;
  }

  return (
    <div 
      ref={innerRef}
      className="relative flex items-center justify-center p-8 overflow-visible"
      style={{ width: size + 64, height: size + 64 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible drop-shadow-2xl"
        >
          <defs>
            {/* The master clipping path based on the shape */}
            <clipPath id="ballClip">
              <path d={currentPath} />
            </clipPath>

            {/* Gradient for the Crescent Shadow */}
            <radialGradient id="crescentShadow" cx="50%" cy="50%" r="50%" fx="80%" fy="80%">
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="70%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.4" />
            </radialGradient>

            {/* Gradient for a soft top-left highlight */}
            <radialGradient id="ballHighlight" cx="30%" cy="30%" r="40%">
              <stop offset="0%" stopColor="white" stopOpacity="0.2" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g 
            transform={`rotate(${rotation}, 50, 50) scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`}
            style={{ 
              transform: `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`,
              transformOrigin: '50% 50%'
            }}
          >
            {/* 1. The Flag Background (Clipped) */}
            <g clipPath="url(#ballClip)">
              {/* Custom Base Color or White base */}
              <rect x="0" y="0" width="100" height="100" fill={ballColor} />
              
              {/* Flag Image */}
              {useFlag && (
                <image 
                  href={internalFlagUrl} 
                  x="0" y="0" 
                  width="100" height="100" 
                  preserveAspectRatio="none"
                  className={isPoland ? "rotate-180 origin-center" : ""} 
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              )}

              {/* 2. Authentic Shading Layers */}
              {/* Inner Depth / Subtle Shadow */}
              {shape.id === 'ball' ? (
                <>
                  <circle cx="50" cy="50" r="50" fill="url(#crescentShadow)" />
                  <circle cx="50" cy="50" r="50" fill="url(#ballHighlight)" />
                </>
              ) : (
                <path d={currentPath} fill="url(#crescentShadow)" />
              )}
            </g>

            {/* 3. Hand-drawn Bold Outline */}
            <path 
              d={currentPath} 
              fill="none" 
              stroke="black" 
              strokeWidth="3.5" 
              strokeLinejoin="round" 
              className="opacity-100"
            />

            {/* 4. Expressions (Eyes) */}
            <g transform={`translate(${eyesOffset.x}, ${eyesOffset.y}) scale(${eyesOffset.scale}) rotate(${eyesOffset.rotation})`} style={{ transformOrigin: '50px 50px' }}>
              {eyes.render('black')}
            </g>

            {/* 5. Accessories */}
            {accessory && (
              <g transform={`translate(${accessory.position.x + hatOffset.x}, ${accessory.position.y + hatOffset.y}) scale(${accessory.position.scale * hatOffset.scale}) rotate(${hatOffset.rotation})`} style={{ transformOrigin: '50px 50px' }}>
                {accessory.render()}
              </g>
            )}

            {/* Accessory 2 */}
            {accessory2 && accessory2.id !== 'none' && (
              <g transform={`translate(${accessory2.position.x + hat2Offset.x}, ${accessory2.position.y + hat2Offset.y}) scale(${accessory2.position.scale * hat2Offset.scale}) rotate(${hat2Offset.rotation})`} style={{ transformOrigin: '50px 50px' }}>
                {accessory2.render()}
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
}
