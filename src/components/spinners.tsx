import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, Clock, Circle, Sparkles } from 'lucide-react';

const LoadingSpinner = ({ 
  variant = 'spinner', 
  size = 'medium', 
  color = '#3b82f6' 
}) => {
  // Size mapping
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32
  };
  
  const iconSize = sizeMap[size];
  
  // Variant configurations
  const variants = {
    spinner: {
      icon: <Loader2 size={iconSize} />,
      animation: {
        rotate: 360,
        transition: {
          rotate: {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }
        }
      }
    },
    pulse: {
      icon: <Circle size={iconSize} />,
      animation: {
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    rotate: {
      icon: <RefreshCw size={iconSize} />,
      animation: {
        rotate: 360,
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    bounce: {
      icon: <Clock size={iconSize} />,
      animation: {
        y: [0, -8, 0],
        transition: {
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    shimmer: {
      icon: <Sparkles size={iconSize} />,
      animation: {
        scale: [1, 1.3, 1],
        rotate: [0, 15, -15, 0],
        transition: {
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  };
  
  const selectedVariant = variants[variant] || variants.spinner;
  
  return (
    <motion.div
      animate={selectedVariant.animation}
      style={{ color, display: 'inline-flex' }}
    >
      {selectedVariant.icon}
    </motion.div>
  );
};

// // Demo component to showcase all variants
// const LoadingDemo = () => {
//   const [activeVariant, setActiveVariant] = useState('spinner');
//   const [activeSize, setActiveSize] = useState('medium');
//   const [activeColor, setActiveColor] = useState('#3b82f6');
  
//   const variants = ['spinner', 'pulse', 'rotate', 'bounce', 'shimmer'];
//   const sizes = ['small', 'medium', 'large'];
//   const colors = [
//     { name: 'Blue', value: '#3b82f6' },
//     { name: 'Red', value: '#ef4444' },
//     { name: 'Green', value: '#22c55e' },
//     { name: 'Purple', value: '#a855f7' },
//     { name: 'Amber', value: '#f59e0b' }
//   ];
  
//   return (
//     <div style={{ 
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//       maxWidth: '800px', 
//       margin: '0 auto', 
//       padding: '2rem',
//       backgroundColor: '#f8fafc'
//     }}>
//       <h1 style={{ 
//         textAlign: 'center', 
//         color: '#1e293b', 
//         marginBottom: '2rem',
//         fontWeight: '700'
//       }}>
//         Loading Animation Variants
//       </h1>
      
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         marginBottom: '2rem' 
//       }}>
//         <LoadingSpinner 
//           variant={activeVariant} 
//           size={activeSize}
//           color={activeColor}
//         />
//       </div>
      
//       <div style={{ 
//         backgroundColor: 'white', 
//         borderRadius: '12px', 
//         padding: '1.5rem', 
//         boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//         marginBottom: '2rem'
//       }}>
//         <h2 style={{ marginBottom: '1rem', color: '#334155' }}>Customize</h2>
        
//         <div style={{ marginBottom: '1.5rem' }}>
//           <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
//             Variant:
//           </label>
//           <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
//             {variants.map(variant => (
//               <button
//                 key={variant}
//                 onClick={() => setActiveVariant(variant)}
//                 style={{
//                   padding: '0.5rem 1rem',
//                   borderRadius: '6px',
//                   border: 'none',
//                   backgroundColor: activeVariant === variant ? activeColor : '#e2e8f0',
//                   color: activeVariant === variant ? 'white' : '#475569',
//                   cursor: 'pointer',
//                   textTransform: 'capitalize',
//                   fontWeight: '500'
//                 }}
//               >
//                 {variant}
//               </button>
//             ))}
//           </div>
//         </div>
        
//         <div style={{ marginBottom: '1.5rem' }}>
//           <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
//             Size:
//           </label>
//           <div style={{ display: 'flex', gap: '0.5rem' }}>
//             {sizes.map(size => (
//               <button
//                 key={size}
//                 onClick={() => setActiveSize(size)}
//                 style={{
//                   padding: '0.5rem 1rem',
//                   borderRadius: '6px',
//                   border: 'none',
//                   backgroundColor: activeSize === size ? activeColor : '#e2e8f0',
//                   color: activeSize === size ? 'white' : '#475569',
//                   cursor: 'pointer',
//                   textTransform: 'capitalize',
//                   fontWeight: '500'
//                 }}
//               >
//                 {size}
//               </button>
//             ))}
//           </div>
//         </div>
        
//         <div>
//           <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
//             Color:
//           </label>
//           <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
//             {colors.map(color => (
//               <button
//                 key={color.value}
//                 onClick={() => setActiveColor(color.value)}
//                 style={{
//                   padding: '0.5rem 1rem',
//                   borderRadius: '6px',
//                   border: 'none',
//                   backgroundColor: color.value,
//                   color: 'white',
//                   cursor: 'pointer',
//                   opacity: activeColor === color.value ? 1 : 0.7,
//                   fontWeight: '500'
//                 }}
//               >
//                 {color.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
      
//       <div style={{ 
//         backgroundColor: 'white', 
//         borderRadius: '12px', 
//         padding: '1.5rem', 
//         boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
//       }}>
//         <h2 style={{ marginBottom: '1rem', color: '#334155' }}>All Variants</h2>
//         <div style={{ 
//           display: 'grid', 
//           gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
//           gap: '1.5rem' 
//         }}>
//           {variants.map(variant => (
//             <div key={variant} style={{ 
//               display: 'flex', 
//               flexDirection: 'column', 
//               alignItems: 'center',
//               padding: '1rem',
//               borderRadius: '8px',
//               backgroundColor: '#f1f5f9'
//             }}>
//               <LoadingSpinner variant={variant} />
//               <span style={{ marginTop: '0.5rem', textTransform: 'capitalize' }}>
//                 {variant}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       <div style={{ 
//         marginTop: '2rem', 
//         textAlign: 'center', 
//         color: '#64748b',
//         fontSize: '0.875rem'
//       }}>
//         Click on the options above to customize the loading animation
//       </div>
//     </div>
//   );
// };

// export default LoadingDemo;