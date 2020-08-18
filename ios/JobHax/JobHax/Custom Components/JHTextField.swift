//
//  JHTextField.swift
//  JobHax
//
//  Created by Yinan Qiu on 8/18/20.
//  Copyright © 2020 Yinan. All rights reserved.
//

import UIKit

class JHTextField: UITextField {
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        configure()
    }
    
    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
    
    private func configure() {
        translatesAutoresizingMaskIntoConstraints = false
        heightAnchor.constraint(equalToConstant: 80).isActive = true
        autocorrectionType = .no
        autocapitalizationType = .none
        
        layer.borderWidth = 5
        layer.borderColor = UIColor.systemIndigo.cgColor
        
        textAlignment = .center
        textColor = .systemIndigo
        
        tintColor = .systemIndigo
    }
    
}
