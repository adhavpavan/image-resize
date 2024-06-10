import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, Input, Upload, Modal, Menu } from 'antd';
import Moveable from 'react-moveable';
import { UploadOutlined, SaveOutlined, FolderOpenOutlined } from '@ant-design/icons';

const { Option } = Select;

const DesignTool = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showNfcOverlay, setShowNfcOverlay] = useState(false);
  const [stickerShape, setStickerShape] = useState('rectangle');
  const containerRef = useRef(null);

  const addElement = (type, content = null) => {
    const newElement = {
      id: elements.length,
      type,
      content: content || (type === 'text' ? 'Edit Me' : null),
      width: 100,
      height: 100,
      x: 50,
      y: 50,
      backgroundColor: '#ffffff',
    };
    setElements([...elements, newElement]);
  };

  const updateElement = (id, newProps) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...newProps } : el));
  };

  const handleElementClick = (id) => {
    setSelectedElement(id);
  };

  const handleUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      addElement('image', e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const saveDesign = () => {
    const design = { elements, backgroundColor, stickerShape };
    localStorage.setItem('nfcStickerDesign', JSON.stringify(design));
    Modal.success({ content: 'Design saved successfully!' });
  };

  const loadDesign = () => {
    const savedDesign = localStorage.getItem('nfcStickerDesign');
    if (savedDesign) {
      const { elements, backgroundColor, stickerShape } = JSON.parse(savedDesign);
      setElements(elements);
      setBackgroundColor(backgroundColor);
      setStickerShape(stickerShape);
      Modal.success({ content: 'Design loaded successfully!' });
    } else {
      Modal.error({ content: 'No saved design found!' });
    }
  };

  const handleKeyDown = (e) => {
    if (selectedElement !== null) {
      const step = 1;
      const element = elements.find(el => el.id === selectedElement);
      if (e.key === 'ArrowUp') {
        updateElement(selectedElement, { y: element.y - step });
      } else if (e.key === 'ArrowDown') {
        updateElement(selectedElement, { y: element.y + step });
      } else if (e.key === 'ArrowLeft') {
        updateElement(selectedElement, { x: element.x - step });
      } else if (e.key === 'ArrowRight') {
        updateElement(selectedElement, { x: element.x + step });
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElement, elements]);

  const getStickerShapeStyle = () => {
    switch (stickerShape) {
      case 'round':
        return { borderRadius: '50%' };
      case 'square':
        return { borderRadius: '0' };
      default:
        return {};
    }
  };

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="save" icon={<SaveOutlined />} onClick={saveDesign}>Save Design</Menu.Item>
        <Menu.Item key="load" icon={<FolderOpenOutlined />} onClick={loadDesign}>Load Design</Menu.Item>
      </Menu>
      <div className="toolbar">
        <Button onClick={() => addElement('text')}>Add Text</Button>
        <Upload beforeUpload={() => false} onChange={handleUpload}>
          <Button icon={<UploadOutlined />}>Upload Logo</Button>
        </Upload>
        <Input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          title="Background Color"
        />
        <Select defaultValue="rectangle" style={{ width: 120 }} onChange={setStickerShape}>
          <Option value="rectangle">Rectangle</Option>
          <Option value="round">Round</Option>
          <Option value="square">Square</Option>
        </Select>
        <Button onClick={() => setShowNfcOverlay(!showNfcOverlay)}>Toggle NFC Overlay</Button>
      </div>

      <div
        className="design-area"
        style={{ ...getStickerShapeStyle(), backgroundColor }}
        ref={containerRef}
      >
        {elements.map((el, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              backgroundColor: el.backgroundColor,
            }}
            onClick={() => handleElementClick(el.id)}
          >
            {el.type === 'text' && <span>{el.content}</span>}
            {el.type === 'image' && <img src={el.content} alt="logo" style={{ width: '100%', height: '100%' }} />}
          </div>
        ))}

        {selectedElement !== null && (
          <Moveable
            target={containerRef.current.children[selectedElement]}
            draggable={true}
            resizable={true}
            onDrag={({ target, left, top }) => {
              updateElement(selectedElement, { x: left, y: top });
            }}
            onResize={({ target, width, height, drag }) => {
              updateElement(selectedElement, { width, height, x: drag.left, y: drag.top });
            }}
            renderDirections={['se']}
            edge={false}
            keepRatio={false}
            minWidth={100}
            minHeight={100}
            maxWidth={600}
            maxHeight={600}
          />
        )}
      </div>

      {showNfcOverlay && (
        <div className="nfc-overlay">
          <img src="/nfc-overlay.png" alt="NFC Overlay" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
        </div>
      )}

      <style jsx>{`
        .toolbar {
          margin-bottom: 20px;
        }
        .design-area {
          position: relative;
          width: 800px;
          height: 600px;
          border: 1px solid #ccc;
          overflow: hidden;
        }
        .nfc-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}; 93567 84808

export default DesignTool;
